<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CCTV Monitoring Pekanbaru</title>
    
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
                    <h1 class="text-base md:text-lg font-bold leading-tight">CCTV PKU</h1>
                    <p class="text-[10px] md:text-xs text-slate-400">Pekanbaru Online</p>
                </div>
            </div>
            
            <!-- Right Side -->
            <div class="flex items-center gap-3 md:gap-4">
                <div class="live-badge text-[10px] md:text-xs">LIVE</div>
                <span class="hidden md:inline text-slate-400">|</span>
                <span class="hidden md:inline text-sm">Pekanbaru</span>
                <span class="hidden md:inline text-slate-400">|</span>
                <span id="current-time" class="text-xs md:text-sm font-medium font-mono">00:00:00</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="py-6 md:py-10 text-center">
        <div class="max-w-4xl mx-auto px-4">
            <p class="text-slate-300 mb-2 text-sm md:text-base">
                Pantau keamanan wilayah Pekanbaru secara real-time dengan sistem 
                <a href="#" class="text-blue-400 hover:underline font-semibold">CCTV PKU</a>.
            </p>
            <p class="text-slate-400 text-xs md:text-sm mb-5">
                Akses gratis 24 jam untuk memantau berbagai lokasi di Pekanbaru, Riau.
            </p>
            
            <!-- Coverage Badge -->
            <div class="coverage-badge mb-6">
                <svg class="w-4 h-4 md:w-5 md:h-5 text-orange-400 shrink-0 mt-0.5 md:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Area coverage: <span class="text-orange-400 font-semibold">Senapelan</span> & <span class="text-orange-400 font-semibold">Pekanbaru Kota</span></span>
            </div>
            
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
                    <span>Multi-View</span>
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
                    <div class="stats-number green" id="online-count">20</div>
                    <div class="text-left">
                        <p class="text-[10px] md:text-xs text-slate-400">Online</p>
                        <p class="text-xs md:text-sm font-medium">Kamera</p>
                    </div>
                </div>
                <div class="stats-card">
                    <div class="stats-number orange" id="area-count">8</div>
                    <div class="text-left">
                        <p class="text-[10px] md:text-xs text-slate-400">Monitoring</p>
                        <p class="text-xs md:text-sm font-medium">Area</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CCTV Section -->
    <section class="pb-10">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 class="text-xl md:text-2xl font-bold mb-1">CCTV Publik</h2>
                    <p class="text-xs md:text-sm text-slate-400"><span id="camera-count">20</span> kamera tersedia • Streaming langsung 24/7</p>
                </div>
                
                <div class="flex gap-2">
                    <div class="search-bar flex-1 md:w-72">
                        <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input type="text" id="search-input" placeholder="Cari lokasi...">
                        <span class="keyboard-hint hidden md:block">⌘K</span>
                    </div>
                    
                    <div class="view-toggle shrink-0">
                        <button class="active" id="map-view-btn" title="Map View">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                            </svg>
                        </button>
                        <button id="grid-view-btn" title="Grid View">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Map View -->
            <div id="map-view" class="map-container">
                <!-- Area Dropdown -->
                <div class="absolute top-3 left-3 z-10">
                    <div class="map-dropdown">
                        <select id="area-filter">
                            <option value="all">Pekanbaru (20)</option>
                            <option value="sudirman">Sudirman (7)</option>
                            <option value="mtq">MTQ (2)</option>
                            <option value="tuanku-tambusai">Tuanku Tambusai (2)</option>
                            <option value="garuda-sakti">Garuda Sakti (1)</option>
                            <option value="rumbai">Rumbai (3)</option>
                            <option value="sembilang">Sembilang (3)</option>
                            <option value="tuan-kadi">Tuan Kadi (2)</option>
                            <option value="mpp">MPP (1)</option>
                        </select>
                    </div>
                </div>
                
                <!-- Status Counter -->
                <div class="absolute top-3 right-3 z-10">
                    <div class="flex gap-2 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
                        <span class="flex items-center gap-1.5 text-xs">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            <span id="stabil-count">19</span>
                        </span>
                        <span class="flex items-center gap-1.5 text-xs">
                            <span class="w-2 h-2 rounded-full bg-slate-500"></span>
                            <span id="tunnel-count">1</span>
                        </span>
                    </div>
                </div>
                
                <!-- Map -->
                <div id="map"></div>
                
                <!-- Legend (Desktop only) -->
                <div class="absolute bottom-3 left-3 z-10 hidden md:block">
                    <div class="flex gap-4 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-xs">
                        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-green-500"></span> Stabil</span>
                        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-orange-500"></span> Tunnel</span>
                        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-500"></span> Offline</span>
                        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500"></span> Perbaikan</span>
                    </div>
                </div>
                
                <!-- Zoom Controls -->
                <div class="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
                    <button id="zoom-in" class="w-8 h-8 flex items-center justify-center bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-blue-600 transition text-lg">+</button>
                    <button id="zoom-out" class="w-8 h-8 flex items-center justify-center bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-blue-600 transition text-lg">−</button>
                </div>
            </div>
            
            <!-- Grid View (Hidden by default) -->
            <div id="grid-view" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Grid items will be populated by JS -->
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 text-center text-xs md:text-sm text-slate-500">
            <p>© 2026 CCTV PKU Pekanbaru. Powered by Google Maps.</p>
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span id="modal-location">Location</span>
                        <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-medium uppercase" id="modal-area">AREA</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between md:justify-end gap-3">
                    <div class="modal-controls">
                        <button title="Zoom Out">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
                            </svg>
                        </button>
                        <button title="100%">100%</button>
                        <button title="Zoom In">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                            </svg>
                        </button>
                    </div>
                    <div class="status-indicator" id="modal-status">Stabil</div>
                </div>
            </div>
        </div>
    </div>

    <!-- HLS.js for .m3u8 streaming -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    
    <!-- Google Maps Script -->
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap">
    </script>
</body>
</html>
