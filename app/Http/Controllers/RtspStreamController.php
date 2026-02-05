<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

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
     */
    public function validateCamera(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'rtsp_url' => 'required|string',
            'username' => 'nullable|string|max:50',
            'password' => 'nullable|string|max:100',
        ]);

        $rtspUrl = $validated['rtsp_url'];
        
        if (!empty($validated['username'])) {
            $parsed = parse_url($rtspUrl);
            $scheme = $parsed['scheme'] ?? 'rtsp';
            $host = $parsed['host'] ?? '';
            $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
            $path = $parsed['path'] ?? '';
            $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';
            
            $credentials = rawurlencode($validated['username']);
            if (!empty($validated['password'])) {
                $credentials .= ':' . rawurlencode($validated['password']);
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
     * Check if running on Windows
     */
    private function isWindows(): bool
    {
        return strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
    }

    /**
     * Get FFmpeg binary path
     */
    private function getFFmpegPath(): string
    {
        // Check environment variable first
        $envPath = env('FFMPEG_PATH');
        if ($envPath && file_exists($envPath)) {
            return $envPath;
        }

        // Platform-specific defaults
        if ($this->isWindows()) {
            // Common Windows FFmpeg locations
            $windowsPaths = [
                'C:\ffmpeg\bin\ffmpeg.exe',
                'C:\Program Files\ffmpeg\bin\ffmpeg.exe',
                'C:\ffmpeg-8.0.1-essentials_build\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe',
            ];
            foreach ($windowsPaths as $path) {
                if (file_exists($path)) {
                    return $path;
                }
            }
            return 'ffmpeg'; // Hope it's in PATH
        }

        // Linux/Docker - FFmpeg is usually in /usr/bin
        return '/usr/bin/ffmpeg';
    }

    /**
     * Get path separator for current OS
     */
    private function getPathSeparator(): string
    {
        return $this->isWindows() ? '\\' : '/';
    }

    /**
     * Stream custom CCTV via RTSP to HLS conversion
     */
    public function stream(Request $request)
    {
        $rtspUrl = $request->input('url');
        $id = $request->input('id'); // Get Camera ID

        Log::info("Stream Request Received: " . $rtspUrl);
        
        if (empty($rtspUrl)) {
            return response()->json(['error' => 'RTSP URL is required'], 400);
        }

        // Use ID for stream_id if provided (avoids collision for same URL), otherwise hash URL
        $streamId = $id ? $id : md5($rtspUrl);
        
        // Sanitize ID just in case
        $streamId = preg_replace('/[^a-zA-Z0-9_-]/', '', $streamId);

        $hlsDir = $this->getHlsDirectory();
        $sep = $this->getPathSeparator();
        $outputPath = "{$hlsDir}{$sep}{$streamId}";
        $playlistPath = "{$outputPath}{$sep}index.m3u8";

        if (!is_dir($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        $pidFile = "{$outputPath}{$sep}ffmpeg.pid";
        
        // Check if already running
        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            if ($this->isProcessRunning($pid)) {
                return response()->json([
                    'success' => true,
                    'stream_id' => $streamId,
                    'playlist_url' => "/api/custom-cctv/hls/{$streamId}/index.m3u8",
                    'status' => 'running',
                ]);
            }
            // Process dead but files exist. CLEANUP to force fresh live stream.
            @unlink($pidFile);
            
            // Wait briefly to ensure file handles are released by OS
            usleep(100000); // 0.1s
            
            // KILL ORPHANS BEFORE CLEANUP
            $this->ensureOrphanProcessesKilled($streamId);

            $this->cleanupStreamDirectory($outputPath); 
        } elseif (is_dir($outputPath)) {
             // Directory exists but no PID? Cleanup just in case.
             $this->ensureOrphanProcessesKilled($streamId);
             $this->cleanupStreamDirectory($outputPath);
        }

        if (!is_dir($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        $ffmpegBinary = $this->getFFmpegPath();
        $segmentPattern = "{$outputPath}{$sep}segment_%03d.ts";
        $logFile = "{$outputPath}{$sep}ffmpeg.log";

        // FFmpeg arguments - platform agnostic
        $ffmpegArgs = [
            '-y', '-nostdin',
            '-analyzeduration', '100000', '-probesize', '100000',
            '-loglevel', 'warning',
            '-rtsp_transport', 'tcp',
            '-i', $rtspUrl,
            '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
            '-force_key_frames', 'expr:gte(t,n_forced*2)',
            '-vf', 'scale=1280:-2',
            '-crf', '28', '-maxrate', '1500k', '-bufsize', '3000k',
            '-an',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '5',
            '-hls_flags', 'delete_segments+append_list+omit_endlist',
            '-hls_segment_filename', $segmentPattern,
            $playlistPath
        ];

        if ($this->isWindows()) {
            $pid = $this->startWindowsProcess($ffmpegBinary, $ffmpegArgs, $outputPath, $logFile, $streamId);
        } else {
            $pid = $this->startLinuxProcess($ffmpegBinary, $ffmpegArgs, $logFile);
        }

        if ($pid) {
            file_put_contents($pidFile, $pid);
        }

        // Wait a small amount for startup
        usleep(500000);

        return response()->json([
            'success' => true,
            'stream_id' => $streamId,
            'playlist_url' => "/api/custom-cctv/hls/{$streamId}/index.m3u8",
            'status' => 'starting',
        ]);
    }

    /**
     * Start FFmpeg process on Linux
     */
    private function startLinuxProcess(string $ffmpegBinary, array $args, string $logFile): int
    {
        $escapedArgs = array_map('escapeshellarg', $args);
        $command = escapeshellarg($ffmpegBinary) . ' ' . implode(' ', $escapedArgs);
        $fullCommand = "nohup {$command} > " . escapeshellarg($logFile) . " 2>&1 & echo $!";
        
        $output = [];
        exec($fullCommand, $output);
        
        return isset($output[0]) ? (int)$output[0] : 0;
    }

    /**
     * Start FFmpeg process on Windows
     */
    private function startWindowsProcess(string $ffmpegBinary, array $args, string $outputPath, string $logFile, string $streamId): int
    {
        // Generate a Batch File for this specific stream
        $batchContent = "@echo off\r\n";
        $batchContent .= "title FFmpeg_Stream_{$streamId}\r\n";
        $batchContent .= "cd /d \"{$outputPath}\"\r\n";
        $batchContent .= "\"{$ffmpegBinary}\" ";
        
        foreach ($args as $arg) {
             $safeArg = str_replace('%', '%%', $arg);
             $batchContent .= " \"{$safeArg}\"";
        }
        
        $batchContent .= " > \"{$logFile}\" 2>&1\r\n";
        $batchContent .= "exit\r\n";
        
        $batchFile = "{$outputPath}\\run.bat";
        file_put_contents($batchFile, $batchContent);
        
        Log::info("Generated Batch File at: {$batchFile}");
        
        // Execute via COM object if available
        try {
            if (class_exists('COM')) {
                $wmi = new \COM("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2");
                $process = $wmi->Get("Win32_Process");
                $pid = 0;
                $result = $process->Create("cmd.exe /c \"{$batchFile}\"", null, null, $pid);
                
                if ($result == 0) {
                    return $pid;
                }
            }
        } catch (\Exception $e) {
            Log::warning("WMI Process Start failed: " . $e->getMessage());
        }

        // Fallback: WMIC
        $wmicCmd = "wmic process call create \"cmd.exe /c \\\"{$batchFile}\\\"\"";
        $output = shell_exec($wmicCmd);
        
        if (preg_match('/ProcessId = (\d+);/', $output, $matches)) {
            return (int)$matches[1];
        }
        
        // Last resort: popen
        popen("start /B \"\" \"{$batchFile}\"", "r");
        return 0;
    }

    private function ensureOrphanProcessesKilled(string $streamId)
    {
        if ($this->isWindows()) {
            exec("taskkill /F /FI \"WINDOWTITLE eq FFmpeg_Stream_$streamId\" >NUL 2>&1");
        } else {
            // Kill by stream ID pattern
            exec("pkill -f 'ffmpeg.*{$streamId}' >/dev/null 2>&1");
        }
    }

    private function isProcessRunning(int $pid): bool
    {
        if ($pid <= 0) return false;
        
        if ($this->isWindows()) {
            $output = [];
            exec("tasklist /FI \"PID eq $pid\" 2>&1", $output);
            return count(preg_grep("/$pid/", $output)) > 0;
        } else {
            return file_exists("/proc/{$pid}");
        }
    }

    public function serveHls(Request $request, string $streamId, string $file = 'index.m3u8')
    {
        $hlsDir = $this->getHlsDirectory();
        $filePath = "{$hlsDir}/{$streamId}/{$file}";

        if (!file_exists($filePath)) {
            return response('File not found', 404);
        }

        $content = file_get_contents($filePath);
        
        $contentType = 'application/vnd.apple.mpegurl';
        if (str_ends_with($file, '.ts')) {
            $contentType = 'video/mp2t';
        }

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
            ->header('Cache-Control', 'no-cache');
    }

    public function stopStream(string $streamId)
    {
        $hlsDir = $this->getHlsDirectory();
        $outputPath = "{$hlsDir}/{$streamId}";
        $pidFile = "{$outputPath}/ffmpeg.pid";

        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            if ($pid > 0) {
                if ($this->isWindows()) {
                    // Force kill on Windows - /T for tree kill (kills children like ffmpeg)
                    exec("taskkill /F /T /PID $pid >NUL 2>&1");
                } else {
                    exec("kill -9 $pid >/dev/null 2>&1");
                }

                // Wait for process to actually exit (max 5 seconds)
                $tries = 0;
                while ($this->isProcessRunning($pid) && $tries < 10) {
                    usleep(500000); // 0.5s
                    $tries++;
                }
            }
            @unlink($pidFile);
        }
        
        // Also ensure orphans are gone
        $this->ensureOrphanProcessesKilled($streamId);

        $this->cleanupStreamDirectory($outputPath);

        return response()->json(['success' => true]);
    }

    public function status(string $streamId)
    {
        $hlsDir = $this->getHlsDirectory();
        $outputPath = "{$hlsDir}/{$streamId}";
        $pidFile = "{$outputPath}/ffmpeg.pid";
        $playlistPath = "{$outputPath}/index.m3u8";

        $running = false;
        if (file_exists($pidFile)) {
            $pid = (int) file_get_contents($pidFile);
            $running = $this->isProcessRunning($pid);
        }

        $logContent = '';
        $logFile = "{$outputPath}/ffmpeg.log";
        if (file_exists($logFile)) {
            $logContent = substr(file_get_contents($logFile), -1000); // Last 1000 chars
        }

        return response()->json([
            'stream_id' => $streamId,
            'running' => $running,
            'ready' => file_exists($playlistPath),
            'log' => $logContent
        ]);
    }

    private function cleanupStreamDirectory(string $path)
    {
        if (!is_dir($path)) return;
        
        $files = glob("{$path}/*");
        foreach ($files as $file) {
            if (is_file($file)) {
                // Suppress errors and try to delete code
                try {
                    @unlink($file);
                } catch (\Exception $e) {
                    Log::warning("Failed to delete file during cleanup: $file - " . $e->getMessage());
                }
            }
        }
        @rmdir($path);
    }
}
