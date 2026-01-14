<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

class RtspStreamController extends Controller
{
    /**
     * Directory for HLS output files
     */
    private function getHlsDirectory(): string
    {
        $dir = storage_path('app/hls');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Add a custom CCTV camera
     * Note: This just validates the input. Storage is handled client-side in localStorage.
     */
    public function validateCamera(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'rtsp_url' => 'required|string',
            'username' => 'nullable|string|max:50',
            'password' => 'nullable|string|max:100',
        ]);

        // Build the full RTSP URL with credentials if provided
        $rtspUrl = $validated['rtsp_url'];
        
        if (!empty($validated['username'])) {
            // Parse URL and add credentials
            $parsed = parse_url($rtspUrl);
            $scheme = $parsed['scheme'] ?? 'rtsp';
            $host = $parsed['host'] ?? '';
            $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
            $path = $parsed['path'] ?? '';
            $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';
            
            $credentials = $validated['username'];
            if (!empty($validated['password'])) {
                $credentials .= ':' . $validated['password'];
            }
            
            $rtspUrl = "{$scheme}://{$credentials}@{$host}{$port}{$path}{$query}";
        }

        return response()->json([
            'success' => true,
            'id' => Str::uuid()->toString(),
            'name' => $validated['name'],
            'rtsp_url' => $rtspUrl,
            'created_at' => now()->toISOString(),
        ]);
    }

    /**
     * Stream custom CCTV via RTSP to HLS conversion
     * This creates an HLS stream from an RTSP source using FFmpeg
     */
    public function stream(Request $request)
    {
        $rtspUrl = $request->input('url');
        
        if (empty($rtspUrl)) {
            return response()->json(['error' => 'RTSP URL is required'], 400);
        }

        // Generate unique stream ID based on URL hash
        $streamId = md5($rtspUrl);
        $hlsDir = $this->getHlsDirectory();
        $outputPath = "{$hlsDir}/{$streamId}";
        $playlistPath = "{$outputPath}/index.m3u8";

        // Create output directory
        if (!is_dir($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        // Check if stream is already running
        $pidFile = "{$outputPath}/ffmpeg.pid";
        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            if ($pid > 0 && file_exists("/proc/{$pid}")) {
                // Stream already running, return playlist URL
                return response()->json([
                    'success' => true,
                    'stream_id' => $streamId,
                    'playlist_url' => "/api/custom-cctv/hls/{$streamId}/index.m3u8",
                    'status' => 'running',
                ]);
            }
        }

        // Start FFmpeg process to convert RTSP to HLS
        $ffmpegCmd = sprintf(
            'ffmpeg -rtsp_transport tcp -i %s ' .
            '-c:v libx264 -preset ultrafast -tune zerolatency ' .
            '-c:a aac -ar 44100 ' .
            '-f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments+append_list ' .
            '-hls_segment_filename %s/segment_%%03d.ts ' .
            '%s > /dev/null 2>&1 & echo $!',
            escapeshellarg($rtspUrl),
            escapeshellarg($outputPath),
            escapeshellarg($playlistPath)
        );

        $pid = shell_exec($ffmpegCmd);
        $pid = trim($pid);

        if ($pid) {
            file_put_contents($pidFile, $pid);
        }

        // Wait a bit for FFmpeg to start
        sleep(2);

        return response()->json([
            'success' => true,
            'stream_id' => $streamId,
            'playlist_url' => "/api/custom-cctv/hls/{$streamId}/index.m3u8",
            'status' => 'starting',
        ]);
    }

    /**
     * Serve HLS playlist or segment files
     */
    public function serveHls(Request $request, string $streamId, string $file = 'index.m3u8')
    {
        $hlsDir = $this->getHlsDirectory();
        $filePath = "{$hlsDir}/{$streamId}/{$file}";

        if (!file_exists($filePath)) {
            return response('File not found', 404);
        }

        $content = file_get_contents($filePath);
        
        // Determine content type
        $contentType = 'application/vnd.apple.mpegurl';
        if (str_ends_with($file, '.ts')) {
            $contentType = 'video/mp2t';
        }

        // Rewrite segment URLs in playlist
        if (str_ends_with($file, '.m3u8')) {
            $scheme = $request->header('X-Forwarded-Proto', $request->secure() ? 'https' : 'http');
            $host = $request->header('X-Forwarded-Host', $request->getHttpHost());
            $baseUrl = "{$scheme}://{$host}";
            
            $content = preg_replace_callback(
                '/^(segment_\d+\.ts)$/m',
                function ($matches) use ($streamId, $baseUrl) {
                    return "{$baseUrl}/api/custom-cctv/hls/{$streamId}/{$matches[1]}";
                },
                $content
            );
        }

        return response($content)
            ->header('Content-Type', $contentType)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Cache-Control', 'no-cache');
    }

    /**
     * Stop a running stream
     */
    public function stopStream(string $streamId)
    {
        $hlsDir = $this->getHlsDirectory();
        $outputPath = "{$hlsDir}/{$streamId}";
        $pidFile = "{$outputPath}/ffmpeg.pid";

        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            if ($pid > 0) {
                shell_exec("kill {$pid} 2>/dev/null");
            }
            unlink($pidFile);
        }

        // Clean up HLS files
        if (is_dir($outputPath)) {
            array_map('unlink', glob("{$outputPath}/*"));
            rmdir($outputPath);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Check stream status
     */
    public function status(string $streamId)
    {
        $hlsDir = $this->getHlsDirectory();
        $outputPath = "{$hlsDir}/{$streamId}";
        $pidFile = "{$outputPath}/ffmpeg.pid";
        $playlistPath = "{$outputPath}/index.m3u8";

        $running = false;
        $ready = false;

        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            $running = $pid > 0 && file_exists("/proc/{$pid}");
        }

        $ready = file_exists($playlistPath);

        return response()->json([
            'stream_id' => $streamId,
            'running' => $running,
            'ready' => $ready,
        ]);
    }
}
