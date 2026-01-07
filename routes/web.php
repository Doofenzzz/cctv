<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CctvProxyController;

Route::get('/', function () {
    return view('welcome');
});

// CCTV Proxy routes to bypass CORS
Route::get('/api/cctv/stream/{camId}/{file?}', [CctvProxyController::class, 'stream'])
    ->where('file', '.*');
