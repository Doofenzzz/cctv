<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RtspStreamController;

Route::get('/', function () {
    return view('welcome');
});

// Custom CCTV routes (RTSP streams)
Route::post('/api/custom-cctv/validate', [RtspStreamController::class, 'validateCamera']);
Route::post('/api/custom-cctv/stream', [RtspStreamController::class, 'stream']);
Route::get('/api/custom-cctv/hls/{streamId}/{file?}', [RtspStreamController::class, 'serveHls'])
    ->where('file', '.*');
Route::delete('/api/custom-cctv/stream/{streamId}', [RtspStreamController::class, 'stopStream']);
Route::get('/api/custom-cctv/status/{streamId}', [RtspStreamController::class, 'status']);
