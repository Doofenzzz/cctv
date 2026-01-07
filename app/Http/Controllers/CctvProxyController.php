<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CctvProxyController extends Controller
{
    /**
     * Proxy for CCTV HLS streams to bypass CORS
     */
    public function stream(Request $request, $camId, $file = 'index.m3u8')
    {
        $baseUrl = 'https://cctv.pekanbaru.go.id/hls';
        $url = "{$baseUrl}/cam{$camId}/{$file}";
        
        try {
            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false, // Skip SSL verification for government servers
                ])
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer' => 'https://cctv.pekanbaru.go.id/',
                ])
                ->get($url);
            
            if (!$response->successful()) {
                return response('Stream not available', 503);
            }
            
            $content = $response->body();
            
            // Determine content type based on file
            $contentType = 'application/vnd.apple.mpegurl';
            if (str_ends_with($file, '.ts')) {
                $contentType = 'video/mp2t';
            }
            
            // If it's a playlist file, rewrite the segment URLs to go through proxy
            if (str_ends_with($file, '.m3u8')) {
                // Get the base URL from the current request (works with Cloudflare tunnel)
                // Check for X-Forwarded headers first (set by Cloudflare/proxies)
                $scheme = $request->header('X-Forwarded-Proto', $request->secure() ? 'https' : 'http');
                $host = $request->header('X-Forwarded-Host', $request->getHttpHost()); // getHttpHost includes port
                
                // Build base URL from request
                $requestBaseUrl = "{$scheme}://{$host}";
                
                // Replace relative .ts paths with proxied paths
                $content = preg_replace_callback(
                    '/^([a-zA-Z0-9_\-\.]+\.ts)$/m',
                    function ($matches) use ($camId, $requestBaseUrl) {
                        return "{$requestBaseUrl}/api/cctv/stream/{$camId}/{$matches[1]}";
                    },
                    $content
                );
            }
            
            return response($content)
                ->header('Content-Type', $contentType)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', '*')
                ->header('Cache-Control', 'no-cache');
                
        } catch (\Exception $e) {
            \Log::error('CCTV Proxy Error: ' . $e->getMessage());
            return response('Failed to fetch stream: ' . $e->getMessage(), 500);
        }
    }
}
