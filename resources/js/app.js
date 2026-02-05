// ============================================
// OFFICE CCTV MONITORING
// ============================================

// HLS Player Registry for multiple streams
const hlsPlayers = {};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Real-time clock
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        timeEl.textContent = time;
    }

    // Also update Modal Clock
    const modalTimeEl = document.getElementById('modal-overlay-clock');
    if (modalTimeEl) {
        modalTimeEl.textContent = time;
    }
}

setInterval(updateClock, 1000);
updateClock();

function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function maskRtspUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        if (parsed.password) {
            parsed.password = '****';
        }
        return parsed.toString();
    } catch (e) {
        return url;
    }
}

// ============================================
// MODAL HANDLING
// ============================================

// Close modal
document.getElementById('close-modal')?.addEventListener('click', () => {
    // Only used for "View Detail" if we keep it, currently focusing on Grid
    const modal = document.getElementById('cctv-modal');
    if (modal) modal.classList.remove('active');
});

// Close modal on background click
document.getElementById('cctv-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('cctv-modal')) {
        document.getElementById('close-modal')?.click();
    }
});

// ============================================
// CUSTOM CCTV FUNCTIONALITY
// ============================================

// Storage key for custom CCTVs
const CUSTOM_CCTV_STORAGE_KEY = 'custom_cctvs';

// Get custom CCTVs from localStorage
function getCustomCctvs() {
    const stored = localStorage.getItem(CUSTOM_CCTV_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save custom CCTVs to localStorage
function saveCustomCctvs(cctvs) {
    localStorage.setItem(CUSTOM_CCTV_STORAGE_KEY, JSON.stringify(cctvs));
}

// Update camera count
function updateCameraCount() {
    const cctvs = getCustomCctvs();
    const countEl = document.getElementById('online-count');
    if (countEl) {
        countEl.textContent = cctvs.length;
    }
}

// Open add custom CCTV modal
function openAddCustomCctvModal() {
    document.getElementById('add-cctv-modal')?.classList.add('active');
    document.getElementById('cctv-name')?.focus();
}

// Close add custom CCTV modal
function closeAddCustomCctvModal() {
    document.getElementById('add-cctv-modal')?.classList.remove('active');
    document.getElementById('add-cctv-form')?.reset();
}

// Submit add custom CCTV form
async function submitAddCustomCctv(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-cctv-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    // Show loading
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitLoading) submitLoading.style.display = 'inline-block';

    try {
        const formData = new FormData(form);
        const name = formData.get('name');
        let rtspUrl = formData.get('rtsp_url');
        const username = formData.get('username');
        const password = formData.get('password');

        // Build full URL with credentials if provided
        if (username && rtspUrl) {
            try {
                const parsed = new URL(rtspUrl);
                parsed.username = username;
                if (password) {
                    parsed.password = password;
                }
                rtspUrl = parsed.toString();
            } catch (e) {
                // Manual injection fallback
                if (rtspUrl.startsWith('rtsp://')) {
                    const credentials = password ? `${username}:${password}` : username;
                    rtspUrl = rtspUrl.replace('rtsp://', `rtsp://${credentials}@`);
                }
            }
        }

        // Create new CCTV object
        const newCctv = {
            id: Date.now().toString(),
            name: name,
            rtspUrl: rtspUrl,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const cctvs = getCustomCctvs();

        // Prevent Duplicates
        const exists = cctvs.some(c => c.rtspUrl === rtspUrl);
        if (!exists) {
            cctvs.push(newCctv);
            saveCustomCctvs(cctvs);
        } else {
            // Optional: warn user, but for now just don't add
            // alert('Camera already exists!');
        }

        // Close modal and refresh list
        closeAddCustomCctvModal();
        renderCustomCctvGrid();
        updateCameraCount();

    } catch (error) {
        console.error('Error adding custom CCTV:', error);
        alert('Gagal menambahkan CCTV. Pastikan URL RTSP valid.');
    } finally {
        // Reset button
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.style.display = 'inline';
        if (submitLoading) submitLoading.style.display = 'none';
    }
}

// Render custom CCTV grid
function renderCustomCctvGrid() {
    const grid = document.getElementById('custom-cctv-grid');
    const emptyState = document.getElementById('custom-cctv-empty');
    const cctvs = getCustomCctvs();

    if (!grid) return;

    if (cctvs.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Check which cameras are currently streaming to restore state (optional complexity, skipping for now)

    grid.innerHTML = cctvs.map(cctv => `
        <div class="custom-cctv-card group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg cursor-pointer hover:border-blue-500 transition-colors" onclick="openCustomCctvModal('${cctv.id}')">
            <!-- Video Container -->
            <div class="relative w-full aspect-video bg-black">
                <!-- Thumbnail / Placeholder -->
                <div class="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                    <svg class="w-12 h-12 text-slate-700 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    
                    <!-- Play Overlay -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200">
                             <svg class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info Section -->
            <div class="p-3 border-t border-slate-700 bg-slate-800">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-semibold text-slate-200 text-sm truncate max-w-[150px]">${escapeHtml(cctv.name)}</div>
                        <div class="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">${escapeHtml(maskRtspUrl(cctv.rtspUrl))}</div>
                    </div>
                    <div class="flex items-center gap-2" onclick="event.stopPropagation()">
                        <button onclick="deleteCustomCctv('${cctv.id}')" class="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// FULLSCREEN MODAL HANDLING
// ============================================

let currentModalPlayer = null;
let currentStreamId = null;


// Wait for stream to be ready (playlist generated)
async function waitForStreamReady(streamId) {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (attempts < maxAttempts) {
        try {
            const res = await fetch(`/api/custom-cctv/status/${streamId}`);
            const data = await res.json();

            // Debug Log
            console.log(`Stream Status [${attempts}]:`, data);
            if (data.log) console.log('FFmpeg Log:', data.log);

            if (data.ready) return true;

            // If process died, throw error
            if (attempts > 5 && !data.running) {
                throw new Error('Stream process exited unexpectedly. Log: ' + (data.log || 'No log'));
            }
        } catch (e) {
            console.warn('Status check failed:', e);
        }

        attempts++;
        // Poll faster for better responsiveness (250ms)
        await new Promise(r => setTimeout(r, 250));
    }

    throw new Error('Stream timeout');
}

async function openCustomCctvModal(cctvId) {
    const cctvs = getCustomCctvs();
    const cctv = cctvs.find(c => c.id === cctvId);
    if (!cctv) return;

    // Show Modal
    const modal = document.getElementById('custom-cctv-modal');
    const title = document.getElementById('modal-camera-title');
    const container = document.getElementById('modal-video-container');
    const loading = document.getElementById('modal-loading');

    if (modal) modal.classList.remove('hidden');
    if (title) title.textContent = cctv.name;
    if (container) {
        // Inject Video AND Custom Controls (to prevent controls from flipping)
        container.innerHTML = `
            <div class="relative w-full h-full flex items-center justify-center bg-black">
                <!-- Video Wrapper for Transform (More robust than transforming video directly) -->
                <!-- USING CSS VARIABLES FOR FLIP/ZOOM PERSISTENCE -->
                <div id="video-transform-wrapper" class="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out" 
                     style="transform: scaleX(var(--sx, 1)) scaleY(var(--sy, 1)) scale(var(--z, 1)); --sx: 1; --sy: 1; --z: 1; will-change: transform;">
                    <video id="modal-video" class="w-full h-full object-contain" autoplay playsinline crossorigin="anonymous"></video>
                </div>
                
                <!-- HOVER ZONE (Bottom 25%) - Controls only show when hovering here -->
                <div class="absolute bottom-0 left-0 right-0 h-[30%] z-[50] flex items-end justify-center pb-8 opacity-0 hover:opacity-100 transition-opacity duration-300 px-6 sm:px-12">
                    
                    <!-- Custom Control Bar -->
                    <div class="w-full bg-black/70 backdrop-blur-md rounded-2xl pl-6 pr-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
                        <div class="flex items-center gap-4">
                            <button id="btn-play" class="text-white hover:text-blue-400 transition-colors" title="Play/Pause">
                                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> 
                            </button>
                            
                            <div class="flex items-center gap-2 group/vol">
                                <button id="btn-mute" class="text-white hover:text-blue-400 transition-colors" title="Mute/Unmute">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                                </button>
                            </div>
                            
                            <!-- Zoom Controls -->
                             <div class="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
                                <button onclick="adjustZoom(-0.5)" class="text-white hover:text-blue-400 transition-colors p-1" title="Zoom Out">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                                </button>
                                <span id="zoom-level" class="text-xs font-mono text-slate-300 w-10 text-center">100%</span>
                                <button onclick="adjustZoom(0.5)" class="text-white hover:text-blue-400 transition-colors p-1" title="Zoom In">
                                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                </button>
                                <button onclick="resetZoom()" class="text-white hover:text-yellow-400 transition-colors p-1 ml-1" title="Reset">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                </button>
                            </div>

                             <!-- Flip Controls -->
                            <div class="flex items-center gap-2 border-l border-white/20 pl-4">
                                <button onclick="toggleFlipH()" class="text-white hover:text-blue-400 transition-colors p-1" title="Flip Horizontal">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                                </button>
                                <button onclick="toggleFlipV()" class="text-white hover:text-blue-400 transition-colors p-1" title="Flip Vertical">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                                </button>
                            </div>

                            <div class="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30 ml-auto">
                                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span class="text-[10px] font-bold text-red-400 tracking-wider">LIVE</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                             <button onclick="takeScreenshot()" class="text-white hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-white/10" title="Screenshot">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                             </button>
                             <button id="btn-fullscreen" class="text-white hover:text-blue-400 transition-colors p-2 mr-1 rounded-full hover:bg-white/10" title="Fullscreen">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    if (loading) loading.classList.remove('hidden');

    const video = document.getElementById('modal-video');

    // Attach Control Listeners immediately
    const btnPlay = document.getElementById('btn-play');
    const btnMute = document.getElementById('btn-mute');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    if (btnPlay) {
        btnPlay.onclick = () => {
            if (video.paused) {
                video.play();
                btnPlay.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause
            } else {
                video.pause();
                btnPlay.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; // Play
            }
        };
    }

    if (btnMute) {
        btnMute.onclick = () => {
            video.muted = !video.muted;
            if (video.muted) {
                btnMute.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'; // Muted
            } else {
                btnMute.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>'; // Unmuted
            }
        };
    }

    if (btnFullscreen) {
        btnFullscreen.onclick = () => {
            const container = document.getElementById('modal-video-container'); // Fullscreen the container (wrapper) so controls stay valid!
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) container.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        };
    }

    // Event Listeners for controls are attached via IDs being present in the DOM
    // Initialize Pan/Zoom listeners
    initPanZoomListeners();
    updateTransform();


    try {
        // Request Stream
        const response = await fetch('/api/custom-cctv/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                url: cctv.rtspUrl,
                id: cctv.id // Pass ID to ensure unique stream session per camera
            })
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);

        currentStreamId = data.stream_id;
        await waitForStreamReady(data.stream_id);

        if (loading) loading.classList.add('hidden');

        // Initialize HLS with STABILITY config & OMIT ENDLIST support
        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 30, // Reduce back buffer
                maxBufferLength: 10,
                maxMaxBufferLength: 20,
                liveSyncDurationCount: 1.5, // Target 1.5 segments behind live (approx 3s)
                liveMaxLatencyDurationCount: 4, // Max latency before jump
                manifestLoadingTimeOut: 20000,
                manifestLoadingMaxRetry: Infinity, // Retry forever for live
                manifestLoadingRetryDelay: 1000,
                levelLoadingTimeOut: 20000,
                levelLoadingMaxRetry: Infinity,
                fragLoadingTimeOut: 20000,
                fragLoadingMaxRetry: Infinity,
                startLevel: -1
            });

            hls.loadSource(data.playlist_url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());

            // Auto recover on fatal errors & buffer stalls
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('fatal network error encountered, try to recover');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover');
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            currentModalPlayer = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = data.playlist_url;
            video.play();
            currentModalPlayer = 'native';
        }

    } catch (e) {
        console.error(e);
        alert('Stream failed: ' + e.message);
        closeCustomCctvModal();
    }
}

// Delete Custom CCTV
function deleteCustomCctv(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus kamera ini?')) return;

    const cctvs = getCustomCctvs();
    const newCctvs = cctvs.filter(c => c.id !== id);
    saveCustomCctvs(newCctvs);

    renderCustomCctvGrid();
    updateCameraCount();
}

function closeCustomCctvModal() {
    const modal = document.getElementById('custom-cctv-modal');
    if (modal) modal.classList.add('hidden');

    if (currentModalPlayer) {
        if (currentModalPlayer !== 'native') {
            currentModalPlayer.destroy();
        }
        currentModalPlayer = null;
    }

    const container = document.getElementById('modal-video-container');
    if (container) container.innerHTML = '';

    // Reset Zoom
    currentZoom = 1;
    resetZoom(); // Fixed: was updateZoomUI()

    // Optional: Stop backend stream to save resources
    if (currentStreamId) {
        // fetch(`/api/custom-cctv/stop/${currentStreamId}`, { method: 'POST' }); 
        currentStreamId = null;
    }
}

// ============================================
// MODAL TOOLS: ZOOM & SCREENSHOT & FLIP
// ============================================

let currentZoom = 1;
let flipH = false; // Horizontal Flip (Mirror)
let flipV = false; // Vertical Flip

// Pan State
let isDragging = false;
let startX = 0;
let startY = 0;
let currentPanX = 0;
let currentPanY = 0;
let lastPanX = 0;
let lastPanY = 0;

function adjustZoom(delta) {
    currentZoom += delta;
    if (currentZoom < 1) currentZoom = 1;
    if (currentZoom > 5) currentZoom = 5; // Max 5x

    // Reset pan if zoomed out to 1x
    if (currentZoom === 1) {
        currentPanX = 0;
        currentPanY = 0;
        lastPanX = 0;
        lastPanY = 0;
    }

    updateTransform();
}

function resetZoom() {
    currentZoom = 1;
    flipH = false;
    flipV = false;
    currentPanX = 0;
    currentPanY = 0;
    lastPanX = 0;
    lastPanY = 0;
    updateTransform();
}

function toggleFlipH() {
    flipH = !flipH;
    updateTransform();
}

function toggleFlipV() {
    flipV = !flipV;
    updateTransform();
}

function updateTransform() {
    // TARGET WRAPPER ONLY
    const videoWrapper = document.getElementById('video-transform-wrapper');
    const zoomLabel = document.getElementById('zoom-level');
    const isFullscreen = document.fullscreenElement !== null;

    if (videoWrapper) {
        // Calculation
        const scaleX = flipH ? -1 : 1;
        const scaleY = flipV ? -1 : 1;

        // Use standard style logic with Translate for Pan
        // Translate must come BEFORE Scale for correct panning behavior relative to view
        videoWrapper.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scaleX(${scaleX}) scaleY(${scaleY}) scale(${currentZoom})`;
        videoWrapper.style.transformOrigin = 'center center';

        // Cursor Feedback
        if (currentZoom > 1) {
            videoWrapper.style.cursor = isDragging ? 'grabbing' : 'grab';
        } else {
            videoWrapper.style.cursor = 'default';
        }

        // FULLSCREEN FIX: Ensure the wrapper fills the screen and isn't constrained
        if (isFullscreen) {
            videoWrapper.style.width = '100vw';
            videoWrapper.style.height = '100vh';
            videoWrapper.style.maxWidth = 'none';
            videoWrapper.style.maxHeight = 'none';
        } else {
            videoWrapper.style.width = '100%';
            videoWrapper.style.height = '100%';
            videoWrapper.style.maxWidth = ''; // Reset
            videoWrapper.style.maxHeight = '';
        }
    }

    if (zoomLabel) {
        zoomLabel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

function takeScreenshot() {
    const video = document.getElementById('modal-video');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Apply flips to screenshot context
    ctx.save();
    if (flipH) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    if (flipV) {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
    }

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Download
    const link = document.createElement('a');
    link.download = `cctv-snapshot-${new Date().toISOString().replace(/:/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initialize Pan/Zoom Listeners
function initPanZoomListeners() {
    const videoWrapper = document.getElementById('video-transform-wrapper');
    const container = document.getElementById('modal-video-container');

    if (!container) return;

    const onMouseDown = (e) => {
        if (currentZoom <= 1) return; // Only drag if zoomed
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault(); // Prevent text selection
    };

    const onMouseMove = (e) => {
        if (!isDragging || !videoWrapper) return;
        e.preventDefault();

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let moveX = deltaX;
        let moveY = deltaY;

        // Visual Inversion for Flip (User expects to drag "content")
        if (flipH) moveX = -deltaX;
        if (flipV) moveY = -deltaY;

        let newPanX = lastPanX + moveX;
        let newPanY = lastPanY + moveY;

        // BOUNDARY CONSTRAINTS (Prevent dragging image off screen)
        // Max Offset = (Width * Zoom - Width) / 2
        // If Zoom=1, limit is 0 (Locked)
        const rect = videoWrapper.getBoundingClientRect(); // Use actual rendered size
        // Note: getBoundingClientRect includes the current scale transform! 
        // It's safer to use offsetWidth which is unscaled in layout context usually? 
        // Actually, we know calculate logic: Limit = W * (Z - 1) / 2.

        const w = videoWrapper.offsetWidth;
        const h = videoWrapper.offsetHeight;

        const maxPanX = (w * (currentZoom - 1)) / 2;
        const maxPanY = (h * (currentZoom - 1)) / 2;

        // Clamp
        if (newPanX > maxPanX) newPanX = maxPanX;
        if (newPanX < -maxPanX) newPanX = -maxPanX;
        if (newPanY > maxPanY) newPanY = maxPanY;
        if (newPanY < -maxPanY) newPanY = -maxPanY;

        currentPanX = newPanX;
        currentPanY = newPanY;

        updateTransform();
    };

    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            lastPanX = currentPanX;
            lastPanY = currentPanY;
        }
    };

    // Remove old listeners if any (simple approach: clone or just add new ones carefully)
    // For this scope, simpler to just add unique handlers or rely on modal tear-down
    container.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

// Global Exports
window.openCustomCctvModal = openCustomCctvModal;
window.closeCustomCctvModal = closeCustomCctvModal;
window.openAddCustomCctvModal = openAddCustomCctvModal;
window.closeAddCustomCctvModal = closeAddCustomCctvModal;
window.submitAddCustomCctv = submitAddCustomCctv;
window.deleteCustomCctv = deleteCustomCctv;
window.adjustZoom = adjustZoom;
window.resetZoom = resetZoom;
window.toggleFlipH = toggleFlipH;
window.toggleFlipV = toggleFlipV;
window.takeScreenshot = takeScreenshot;

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderCustomCctvGrid();
    updateCameraCount();

    // Global Fullscreen Listener: Ensures Flip/Zoom persists and Icon updates
    document.addEventListener('fullscreenchange', () => {
        // Enforce re-application of CSS Variables
        updateTransform();

        const btnFullscreen = document.getElementById('btn-fullscreen');
        if (btnFullscreen) {
            if (document.fullscreenElement) {
                // Exit Icon 
                btnFullscreen.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H4m0 0v6m0-6l5 5m5-5h6m0 0v6m0-6l-5 5m5-19v6m0 0h-6m6 0l-5-5m-11 5V4m0 0h6m-6 0l5 5"/></svg>';
            } else {
                // Enter Icon
                btnFullscreen.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>';
            }
        }
    });

    // AGGRESSIVE FIX: Enforce transform every 500ms to fight browser resets
    setInterval(() => {
        if (flipH || flipV || currentZoom !== 1) {
            updateTransform();
        }
    }, 500);

    console.log('CCTV App Loaded - v_FIX_FLIP_PERSIST_001');
});
