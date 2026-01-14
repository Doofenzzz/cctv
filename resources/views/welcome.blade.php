<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>CCTV Monitoring - Office</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass-card border-0 border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="text-base md:text-lg font-bold leading-tight">CCTV Monitor</h1>
                    <p class="text-[10px] md:text-xs text-slate-400">Office Surveillance</p>
                </div>
            </div>
            
            <!-- Right Side -->
            <div class="flex items-center gap-3 md:gap-4">
                <div class="live-badge text-[10px] md:text-xs">LIVE</div>
                <span id="current-time" class="text-xs md:text-sm font-medium font-mono">00:00:00</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="py-8 md:py-12 text-center">
        <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold mb-3">Office CCTV Monitoring</h2>
            <p class="text-slate-300 mb-2 text-sm md:text-base">
                Pantau keamanan kantor Anda secara real-time dari mana saja.
            </p>
            <p class="text-slate-400 text-xs md:text-sm mb-6">
                Mendukung kamera Dahua, EZVIZ, Hikvision, dan IP Camera lainnya via RTSP.
            </p>
            
            <!-- Feature Badges -->
            <div class="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                <div class="feature-badge">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>HD Streaming</span>
                </div>
                <div class="feature-badge">
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>Multi-Camera</span>
                </div>
                <div class="feature-badge">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span>Secure</span>
                </div>
                <div class="feature-badge">
                    <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>24/7 Live</span>
                </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="flex justify-center gap-3 md:gap-4">
                <div class="stats-card">
                    <div class="stats-number green" id="online-count">0</div>
                    <div class="text-left">
                        <p class="text-[10px] md:text-xs text-slate-400">Active</p>
                        <p class="text-xs md:text-sm font-medium">Cameras</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CCTV Section -->
    <section class="pb-10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-xl md:text-2xl font-bold mb-1">Your Cameras</h2>
                    <p class="text-xs md:text-sm text-slate-400">Tambahkan CCTV kantor Anda (Dahua, EZVIZ, Hikvision, dll)</p>
                </div>
                
                <button class="add-cctv-btn" onclick="openAddCustomCctvModal()">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Tambah CCTV
                </button>
            </div>
            
            <!-- Custom CCTV Grid -->
            <div id="custom-cctv-grid" class="custom-cctv-grid">
                <!-- Cards will be populated by JS -->
            </div>
            
            <!-- Empty State -->
            <div id="custom-cctv-empty" class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <p class="mb-4">Belum ada CCTV. Klik "Tambah CCTV" untuk menambahkan kamera Anda.</p>
                <p class="text-xs text-slate-500">Mendukung RTSP stream dari Dahua, EZVIZ, Hikvision, dan IP Camera lainnya.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 text-center text-xs md:text-sm text-slate-500">
            <p>© 2026 Office CCTV Monitor. Secure & Private.</p>
        </div>
    </footer>

    <!-- CCTV Modal -->
    <div class="cctv-modal" id="cctv-modal">
        <div class="cctv-modal-content">
            <button class="close-modal" id="close-modal">×</button>
            
            <div class="relative bg-black">
                <video id="cctv-video" class="cctv-video" autoplay muted playsinline>
                    <source src="" type="video/mp4">
                </video>
                
                <div class="cctv-modal-header">
                    <span id="modal-timestamp" class="font-mono">2026-01-07 09:22:51</span>
                    <span id="modal-camera-name" class="font-semibold pr-10 md:pr-12">CCTV NAME</span>
                </div>
            </div>
            
            <div class="cctv-modal-footer">
                <div class="mb-3 md:mb-0">
                    <h3 class="cctv-title" id="modal-title">CCTV Title</h3>
                    <div class="cctv-location">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span id="modal-location">Office Camera</span>
                        <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-medium uppercase" id="modal-area">OFFICE</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between md:justify-end gap-3">
                    <div class="status-indicator" id="modal-status">Connecting...</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Custom CCTV Modal -->
    <div class="custom-cctv-modal" id="add-cctv-modal">
        <div class="custom-cctv-form">
            <h3>
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Tambah CCTV
            </h3>
            
            <form id="add-cctv-form" onsubmit="submitAddCustomCctv(event)">
                <div class="form-group">
                    <label for="cctv-name">Nama CCTV *</label>
                    <input type="text" id="cctv-name" name="name" placeholder="Contoh: Kantor Lantai 1" required>
                </div>
                
                <div class="form-group">
                    <label for="cctv-url">RTSP URL *</label>
                    <input type="text" id="cctv-url" name="rtsp_url" placeholder="rtsp://192.168.1.100:554/..." required>
                    <small>Format: rtsp://IP:PORT/path atau tcp://ngrok-url:port/path</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cctv-username">Username (opsional)</label>
                        <input type="text" id="cctv-username" name="username" placeholder="admin">
                    </div>
                    <div class="form-group">
                        <label for="cctv-password">Password (opsional)</label>
                        <input type="password" id="cctv-password" name="password" placeholder="••••••">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeAddCustomCctvModal()">Batal</button>
                    <button type="submit" class="btn-submit" id="submit-cctv-btn">
                        <span id="submit-text">Simpan</span>
                        <span id="submit-loading" class="loading-spinner" style="display: none;"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- HLS.js for .m3u8 streaming -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</body>
</html>
