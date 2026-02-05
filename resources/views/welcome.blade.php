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
    
    <style>
        :root {
            /* Light Mode Defaults */
            --bg-primary: linear-gradient(180deg, #ffffff 0%, #e0f2fe 100%);
            --bg-secondary: #ffffff;
            --bg-card: rgba(255, 255, 255, 0.9);
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --border-color: #e2e8f0;
            --accent-blue: #3b82f6;
        }

        /* Dark Mode Overrides - FORCED with high specificity */
        html.dark {
            --bg-primary: #0f172a !important; /* Dark Blue/Slate */
            --bg-secondary: #1e293b !important; /* Dark Slate */
            --bg-card: rgba(15, 23, 42, 0.95) !important;
            --text-primary: #f8fafc !important; /* White-ish */
            --text-secondary: #94a3b8 !important; /* Light Gray */
            --border-color: #334155 !important;
        }
        
        /* Enforce Backgrounds */
        body {
            background: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }
        
        /* Force element updates */
        .bg-\[--bg-card\] { background-color: var(--bg-card) !important; }
        .bg-\[--bg-secondary\] { background-color: var(--bg-secondary) !important; }
        .text-\[--text-primary\] { color: var(--text-primary) !important; }
        .text-\[--text-secondary\] { color: var(--text-secondary) !important; }
    </style>
</head>
<body class="min-h-screen transition-colors duration-300 antialiased selection:bg-blue-500/30">
    <script>
        // Check local storage or system preference
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Update Icon UI
        function updateToggleIcon(isDark) {
            const sun = document.getElementById('icon-sun');
            const moon = document.getElementById('icon-moon');
            if (sun && moon) {
                sun.style.display = isDark ? 'block' : 'none';
                moon.style.display = isDark ? 'none' : 'block';
            }
        }

        // Global toggle function
        window.toggleTheme = function() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            console.log('Theme toggled:', isDark ? 'Dark' : 'Light');
            updateToggleIcon(isDark);
        }

        // Init Icon on Load
        document.addEventListener('DOMContentLoaded', () => {
             const isDark = document.documentElement.classList.contains('dark');
             updateToggleIcon(isDark);
        });
    </script>
    <!-- Header -->
    <header class="relative z-50 bg-[--bg-card] backdrop-blur-md border-b border-[--border-color] transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="text-base md:text-lg font-bold leading-tight text-[--text-primary] transition-colors">CCTV Monitor</h1>
                    <p class="text-[10px] md:text-xs text-[--text-secondary] font-medium transition-colors">Office Surveillance</p>
                </div>
            </div>
            
            <!-- Right Side -->
            <div class="flex items-center gap-3 md:gap-4">
                <button id="theme-toggle" onclick="toggleTheme()" class="transform -translate-y-1 flex items-center justify-center relative z-50 cursor-pointer p-2 rounded-lg bg-[--bg-secondary] border border-[--border-color] text-[--text-secondary] hover:text-[--text-primary] transition-all hover:shadow-md" aria-label="Toggle Dark Mode">
                    <!-- Sun Icon -->
                    <span id="icon-sun" class="flex items-center justify-center" style="display: none;">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </span>
                    <!-- Moon Icon -->
                    <span id="icon-moon" class="flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    </span>
                </button>
                <div class="live-badge bg-green-500/10 text-green-400 border-green-500/20 text-[10px] md:text-xs">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5"></span>LIVE
                </div>
                <span id="current-time" class="text-xs md:text-sm font-semibold font-mono text-[--text-secondary]">00:00:00</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="py-8 md:py-12 text-center relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 relative z-10 transition-all">
            <h2 class="text-2xl md:text-3xl font-bold mb-3 text-[--text-primary] drop-shadow-sm transition-colors">CCTV Monitoring</h2>
            <p class="text-[--text-secondary] mb-2 text-sm md:text-base font-medium transition-colors">
                Pantau keamanan kantor secara real-time.
            </p>
            <p class="text-[--accent-blue] text-xs md:text-sm mb-6 transition-colors">
                Mendukung kamera Dahua, EZVIZ, Hikvision, dan IP Camera lainnya via RTSP.
            </p>
            
            <!-- Feature Badges -->
            <div class="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
                <div class="feature-badge bg-[--bg-secondary] shadow-sm border-[--border-color] text-[--text-secondary] transition-colors">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>HD Streaming</span>
                </div>
                <div class="feature-badge bg-[--bg-secondary] shadow-sm border-[--border-color] text-[--text-secondary] transition-colors">
                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>Multi-Camera</span>
                </div>
                <div class="feature-badge bg-[--bg-secondary] shadow-sm border-[--border-color] text-[--text-secondary] transition-colors">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span>Secure</span>
                </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="flex justify-center gap-3 md:gap-4">
                <div class="stats-card bg-[--bg-secondary] border-[--border-color] text-[--text-secondary] px-6 shadow-sm transition-colors">
                    <div class="stats-number w-10 h-10 rounded-full text-lg bg-blue-50 text-blue-600 flex items-center justify-center" id="online-count">0</div>
                    <div class="text-left">
                        <p class="text-[10px] md:text-xs text-[--text-secondary] uppercase tracking-wider">Active</p>
                        <p class="text-sm font-semibold text-[--text-primary]">Cameras</p>
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
                    <h2 class="text-xl md:text-2xl font-bold mb-1 text-[--text-primary] drop-shadow-sm transition-colors">Your Cameras</h2>
                    <p class="text-xs md:text-sm text-[--text-secondary] transition-colors">Tambahkan CCTV kantor Anda (Dahua, EZVIZ, Hikvision, dll)</p>
                </div>
                
                <button class="add-cctv-btn bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/40 border border-blue-500 font-bold" onclick="openAddCustomCctvModal()">
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
            <div id="custom-cctv-empty" class="empty-state bg-[--bg-secondary] border border-[--border-color] rounded-2xl p-8 shadow-lg transition-colors">
                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </div>
                <p class="mb-2 font-medium text-[--text-primary] text-lg transition-colors">Belum ada CCTV</p>
                <p class="text-xs text-[--text-secondary]">Klik "Tambah CCTV" untuk mulai memantau.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 border-t border-slate-200 dark:border-white/10 transition-colors">
        <div class="max-w-7xl mx-auto px-4 text-center text-xs md:text-sm text-slate-500 dark:text-blue-200/60">
            <p>© 2026 Office CCTV Monitor. Secure & Private.</p>
        </div>
    </footer>

    <!-- CCTV Modal -->
    <div class="cctv-modal" id="cctv-modal">
        <div class="cctv-modal-content bg-slate-900 border border-white/10">
            <button class="close-modal bg-white/10 hover:bg-red-500 hover:text-white" id="close-modal">×</button>
            
            <div class="relative bg-black w-full flex items-center justify-center bg-slate-900 border-b border-white/5">
                <!-- Original height configuration -->
                <video id="cctv-video" class="w-auto h-auto max-w-full max-h-[60vh] object-contain mx-auto" autoplay muted playsinline>
                    <source src="" type="video/mp4">
                </video>
                
                <!-- Overlay Header -->
                <div class="cctv-modal-header pointer-events-none">
                    <span id="modal-timestamp" class="font-mono bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white/90 text-xs shadow-sm border border-white/10">--:--:--</span>
                    <span id="modal-camera-name" class="font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white/90 text-xs shadow-sm mt-1 border border-white/10">CCTV</span>
                </div>
            </div>
            
            <div class="cctv-modal-footer bg-slate-800 border-t border-white/5 text-white">
                <div class="mb-3 md:mb-0">
                    <h3 class="cctv-title text-white" id="modal-title">CCTV Title</h3>
                    <div class="cctv-location">
                        <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span id="modal-location" class="text-slate-400">Office Camera</span>
                        <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold uppercase border border-blue-500/20" id="modal-area">OFFICE</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between md:justify-end gap-3">
                    <div class="status-indicator bg-green-500/20 text-green-400 border border-green-500/20" id="modal-status">Connecting...</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Custom CCTV Modal -->
    <div class="custom-cctv-modal" id="add-cctv-modal">
        <div class="custom-cctv-form bg-[--bg-secondary] shadow-2xl rounded-2xl border border-[--border-color] transition-colors">
            <h3 class="text-[--text-primary] border-b border-[--border-color] pb-4 mb-4 flex items-center gap-3 transition-colors">
                <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[--accent-blue]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </div>
                Tambah Kamera
            </h3>
            
            <form id="add-cctv-form" onsubmit="submitAddCustomCctv(event)">
                <div class="form-group mb-4">
                    <label for="cctv-name" class="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1 block">Nama CCTV *</label>
                    <input type="text" id="cctv-name" name="name" placeholder="Contoh: Kantor Depan" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 transition-all outline-none">
                </div>
                
                <div class="form-group mb-4">
                    <label for="cctv-url" class="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1 block">RTSP URL *</label>
                    <input type="text" id="cctv-url" name="rtsp_url" placeholder="rtsp://192.168.1.100:554/..." required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 text-slate-800 dark:text-white font-mono text-sm rounded-lg px-3 py-2.5 transition-all outline-none">
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="form-group">
                        <label for="cctv-username" class="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1 block">Username</label>
                        <input type="text" id="cctv-username" name="username" placeholder="admin" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 outline-none">
                    </div>
                    <div class="form-group">
                        <label for="cctv-password" class="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1 block">Password</label>
                        <input type="password" id="cctv-password" name="password" placeholder="••••••" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 outline-none">
                    </div>
                </div>
                
                <div class="form-actions pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                    <button type="button" class="px-4 py-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 hover:bg-slate-100 transition-colors" onclick="closeAddCustomCctvModal()">Batal</button>
                    <button type="submit" class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all font-medium flex items-center gap-2" id="submit-cctv-btn">
                        <span id="submit-text">Simpan Kamera</span>
                        <span id="submit-loading" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" style="display: none;"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- HLS.js for .m3u8 streaming -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <!-- Theme Toggle Logic Moved to Head -->
    <!-- Fullscreen Custom CCTV Modal -->
    <div id="custom-cctv-modal" class="fixed inset-0 z-[60] bg-black hidden flex-col">
        <!-- Header / Close Button -->
        <!-- Header / Close Button -->
        <!-- Fixed: opacity-0 hover:opacity-100, and pointer-events-auto (group) to allow hover detection -->
        <div class="absolute top-0 left-0 right-0 p-4 z-[70] flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 opacity-0 hover:opacity-100 group">
            <div class="flex items-center">
                <h3 id="modal-camera-title" class="text-white font-bold text-lg drop-shadow-md px-2">Camera Live View</h3>
                <span id="modal-overlay-clock" class="text-blue-200 font-mono text-lg font-bold ml-4 drop-shadow-sm bg-black/40 px-3 py-1 rounded-md border border-white/10">--:--:--</span>
            </div>
            <div class="flex items-center gap-2 relative z-[80]">
                <!-- Toolbar -->
                 <div class="flex items-center bg-black/50 backdrop-blur-md rounded-full px-2 py-1 gap-1 border border-white/10 mr-4 shadow-lg">
                    <button onclick="takeScreenshot()" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors group relative" title="Screenshot">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </button>
                    <!-- Flip Horizontal (Mirror) -->
                    <button onclick="toggleFlipH()" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Flip Horizontal">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8M8 17h8M5 12h14M12 5l-7 7 7 7M12 5l7 7-7 7" /> <!-- Approximated Flip Icon -->
                            <!-- Better Path for Swap/Flip -->
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 0116 0M4 12a8 8 0 0016 0" opacity="0" /> 
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/> 
                        </svg>
                    </button>
                    <!-- Flip Vertical -->
                    <button onclick="toggleFlipV()" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Flip Vertical">
                        <svg class="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                    </button>
                    <div class="w-px h-4 bg-white/20 mx-1"></div>
                    <button onclick="adjustZoom(-0.25)" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Zoom Out">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                    </button>
                    <span id="zoom-level" class="text-xs font-mono w-12 text-center text-white/90">100%</span>
                    <button onclick="adjustZoom(0.25)" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Zoom In">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <button onclick="resetZoom()" class="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Reset Zoom">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                        </svg>
                    </button>
                </div>

                <button onclick="closeCustomCctvModal()" class="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all backdrop-blur-sm shadow-sm relative z-[80]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Video Container -->
        <div class="flex-grow flex items-center justify-center w-full h-full bg-black relative">
             <div id="modal-video-container" class="w-full h-full flex items-center justify-center">
                 <!-- Video element injected here -->
             </div>
             
             <!-- Loading Indicator -->
             <div id="modal-loading" class="hidden absolute inset-0 flex items-center justify-center bg-black/50 z-[65]">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
             </div>
        </div>
    </div>
</body>
</html>
