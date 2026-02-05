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
        $outputPath = "{$hlsDir}/{$streamId}";
        $playlistPath = "{$outputPath}/index.m3u8";

        if (!is_dir($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        // Normalize paths for Windows to avoid mixed slashes
        $outputPath = str_replace('/', '\\', $outputPath);
        $playlistPath = str_replace('/', '\\', $playlistPath);

        $pidFile = "{$outputPath}\\ffmpeg.pid";
        
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

        // FFmpeg arguments
        // Reduced hls_time to 1 for lower latency
        $ffmpegArgs = [
            '-y', '-nostdin',
            '-analyzeduration', '100000', '-probesize', '100000', // Ultra-fast start (reduce buffer analysis)
            '-loglevel', 'warning', // Reduce log noise unless error
            '-rtsp_transport', 'tcp', // Force TCP for reliability
            '-i', $rtspUrl,
            '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
            '-force_key_frames', 'expr:gte(t,n_forced*2)', // Force Keyframe every 2 seconds (Matches Segment)
            '-vf', 'scale=1280:-2', // Downscale to 720p (Flip moved to Frontend)
            '-crf', '28', '-maxrate', '1500k', '-bufsize', '3000k', // Constrain bitrate further
            '-an', // Disable audio to prevent encoding crashes (common with CCTV G.711/PCM)
            '-f', 'hls',
            '-hls_time', '2', // 2s Segment = Better stability than 1s
            '-hls_list_size', '5', // Increase from 2 to 5 to prevent 404s if player lags (keeps 10s history)
            '-hls_flags', 'delete_segments+append_list+omit_endlist', // CRITICAL: omit_endlist forces "Live"
            '-hls_segment_filename', "{$outputPath}\\segment_%03d.ts",
            $playlistPath
        ];

        // Absolute path to FFmpeg
        $ffmpegBinary = 'C:\ffmpeg-8.0.1-essentials_build\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe';
        
        $logFile = "{$outputPath}\\ffmpeg.log";
        
        // Generate a Batch File for this specific stream
        // This avoids ALL quoting/escaping hell in PowerShell/PHP passing
        $batchContent = "@echo off\r\n";
        // Title hack to find process later if needed
        $batchContent .= "title FFmpeg_Stream_{$streamId}\r\n";
        $batchContent .= "cd /d \"{$outputPath}\"\r\n";
        $batchContent .= "\"{$ffmpegBinary}\" ";
        
        // Add arguments to batch file content
        foreach ($ffmpegArgs as $arg) {
             // Escape % for batch file (e.g. %03d -> %%03d)
             // Because %0 is the script name in cmd.exe
             $safeArg = str_replace('%', '%%', $arg);
             $batchContent .= " \"{$safeArg}\"";
        }
        
        // Redirect output
        $batchContent .= " > \"{$logFile}\" 2>&1\r\n";
        $batchContent .= "exit\r\n";
        
        $batchFile = "{$outputPath}\\run.bat";
        file_put_contents($batchFile, $batchContent);
        
        Log::info("Generated Batch File at: {$batchFile}");
        
        // Execute the batch file in background via CMD (simpler than PowerShell)
        $pid = $this->startBackgroundProcess($batchFile);

        if ($pid) {
            file_put_contents($pidFile, $pid);
        }

        // Wait a small amount for startup (Reduced from 2s to 0.5s for speed)
        usleep(500000);

        return response()->json([
            'success' => true,
            'stream_id' => $streamId,
            'playlist_url' => "/api/custom-cctv/hls/{$streamId}/index.m3u8",
            'status' => 'starting',
        ]);
    }

    private function ensureOrphanProcessesKilled(string $streamId)
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // OPTIMIZATION: WMIC is too slow (1-2s).
            // We set "title FFmpeg_Stream_{$streamId}" in the batch file.
            // So we can use taskkill by Window Title which is instant.
            
            // Kill any CMD window with this specific title
            // /F = Force, /FI = Filter
            exec("taskkill /F /FI \"WINDOWTITLE eq FFmpeg_Stream_$streamId\" >NUL 2>&1");
            
            // Note: killing the CMD wrapper usually kills the child ffmpeg provided we used /T or if cmd was parent.
            // If ffmpeg remains, it's harder to find without WMIC, but usually killing the batch script is enough logic for "Restarting".
            
        } else {
            exec("pkill -f '{$streamId}' >/dev/null 2>&1");
        }
    }

    /**
     * Start a background process compatible with Windows and Linux
     */
    private function startBackgroundProcess(string $batchFile, array $ignored = [], ?string $ignoredLog = null): ?int
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Use WMI to start process - this is the most robust way to detach from Apache/PHP
            // cmd /c start /B "" "path\to\bat" > NUL 2>&1
            $command = "cmd.exe /c \"{$batchFile}\"";
            
            // Execute via COM object if available, otherwise fallback to popen
            try {
                if (class_exists('COM')) {
                    $wmi = new \COM("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2");
                    $process = $wmi->Get("Win32_Process");
                    $pid = 0;
                    // 0 = Hidden Window
                    $result = $process->Create($command, null, null, $pid);
                    
                    if ($result == 0) {
                        return $pid;
                    }
                }
            } catch (\Exception $e) {
                Log::warning("WMI Process Start failed: " . $e->getMessage());
            }

            // Fallback: Use simple popen with start command
            $pHandle = popen("start /B \"\" \"{$batchFile}\"", "r");
            
            // Last resort: WMIC
            // wmic process call create "cmd.exe /c ...."
            $wmicCmd = "wmic process call create \"cmd.exe /c \\\"{$batchFile}\\\"\"";
            $output = shell_exec($wmicCmd);
            
            if (preg_match('/ProcessId = (\d+);/', $output, $matches)) {
                return (int)$matches[1];
            }
            
            return 0; // Failed to get PID
        } else {
             // Fallback for Linux
             return 0;
        }
    }

    private function isProcessRunning(int $pid): bool
    {
        if ($pid <= 0) return false;
        
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
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
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    // Force kill on Windows - /T for tree kill (kills children like ffmpeg)
                    // Added >NUL 2>&1 to hide output and prevent popping up
                    exec("taskkill /F /T /PID $pid >NUL 2>&1");
                } else {
                    exec("kill -9 $pid >NUL 2>&1");
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
