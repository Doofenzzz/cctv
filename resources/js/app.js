// ============================================
// OFFICE CCTV MONITORING
// ============================================

// Global HLS player instance
let hlsPlayer = null;

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
}

setInterval(updateClock, 1000);
updateClock();

// Update modal timestamp
function updateModalTimestamp() {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
    const timestampEl = document.getElementById('modal-timestamp');
    if (timestampEl) {
        timestampEl.textContent = formatted;
    }
}

// ============================================
// MODAL HANDLING
// ============================================

// Close modal
document.getElementById('close-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('cctv-modal');
    const video = document.getElementById('cctv-video');

    if (video) {
        video.pause();
        video.src = '';
    }

    // Destroy HLS player if exists
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }

    if (modal) {
        modal.classList.remove('active');
    }
});

// Close modal on background click
document.getElementById('cctv-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('cctv-modal')) {
        document.getElementById('close-modal')?.click();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('close-modal')?.click();
        closeAddCustomCctvModal();
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
                // If URL parsing fails, try to inject credentials manually
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
        cctvs.push(newCctv);
        saveCustomCctvs(cctvs);

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

    grid.innerHTML = cctvs.map(cctv => `
        <div class="custom-cctv-card" data-id="${cctv.id}">
            <div class="custom-cctv-card-preview" onclick="playCustomCctv('${cctv.id}')">
                <div class="play-overlay">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div style="color: var(--text-secondary); font-size: 12px;">Klik untuk stream</div>
            </div>
            <div class="custom-cctv-card-info">
                <div>
                    <div class="custom-cctv-card-name">${escapeHtml(cctv.name)}</div>
                    <div class="custom-cctv-card-url" title="${escapeHtml(cctv.rtspUrl)}">${escapeHtml(maskRtspUrl(cctv.rtspUrl))}</div>
                </div>
                <div class="custom-cctv-card-actions">
                    <button onclick="deleteCustomCctv('${cctv.id}')" class="delete" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Mask RTSP URL for display (hide password)
function maskRtspUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.password) {
            parsed.password = '****';
        }
        return parsed.toString();
    } catch {
        return url;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Play custom CCTV stream
async function playCustomCctv(id) {
    const cctvs = getCustomCctvs();
    const cctv = cctvs.find(c => c.id === id);

    if (!cctv) {
        alert('CCTV tidak ditemukan.');
        return;
    }

    // Open the CCTV modal
    const modal = document.getElementById('cctv-modal');
    const video = document.getElementById('cctv-video');

    // Update modal content
    const titleEl = document.getElementById('modal-title');
    const cameraNameEl = document.getElementById('modal-camera-name');
    const locationEl = document.getElementById('modal-location');
    const areaEl = document.getElementById('modal-area');
    const statusEl = document.getElementById('modal-status');

    if (titleEl) titleEl.textContent = cctv.name;
    if (cameraNameEl) cameraNameEl.textContent = cctv.name.toUpperCase();
    if (locationEl) locationEl.textContent = 'Office Camera';
    if (areaEl) areaEl.textContent = 'OFFICE';
    if (statusEl) {
        statusEl.textContent = 'Connecting...';
        statusEl.style.background = 'rgba(249, 115, 22, 0.15)';
        statusEl.style.color = '#f97316';
    }

    // Show modal
    if (modal) modal.classList.add('active');

    // Destroy previous HLS instance
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }

    try {
        // Request stream from backend
        const response = await fetch('/api/custom-cctv/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({ url: cctv.rtspUrl })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to start stream');
        }

        // Wait for stream to be ready
        await waitForStreamReady(data.stream_id);

        // Play HLS stream
        const streamUrl = data.playlist_url;

        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            hlsPlayer = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hlsPlayer.loadSource(streamUrl);
            hlsPlayer.attachMedia(video);
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
                if (statusEl) {
                    statusEl.textContent = 'Streaming';
                    statusEl.style.background = 'rgba(34, 197, 94, 0.15)';
                    statusEl.style.color = '#22c55e';
                }
            });
            hlsPlayer.on(Hls.Events.ERROR, function (event, data) {
                console.error('HLS Error:', data);
                if (data.fatal && statusEl) {
                    statusEl.textContent = 'Error';
                    statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
                    statusEl.style.color = '#ef4444';
                }
            });
        } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', function () {
                video.play();
                if (statusEl) {
                    statusEl.textContent = 'Streaming';
                    statusEl.style.background = 'rgba(34, 197, 94, 0.15)';
                    statusEl.style.color = '#22c55e';
                }
            });
        }

    } catch (error) {
        console.error('Error playing custom CCTV:', error);
        const statusEl = document.getElementById('modal-status');
        if (statusEl) {
            statusEl.textContent = 'Error';
            statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
            statusEl.style.color = '#ef4444';
        }
    }

    // Update timestamp
    updateModalTimestamp();
}

// Wait for stream to be ready
async function waitForStreamReady(streamId) {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`/api/custom-cctv/status/${streamId}`);
            const data = await response.json();

            if (data.ready) {
                return true;
            }
        } catch (e) {
            console.error('Error checking stream status:', e);
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Stream timeout');
}

// Delete custom CCTV
function deleteCustomCctv(id) {
    if (!confirm('Hapus CCTV ini?')) {
        return;
    }

    const cctvs = getCustomCctvs();
    const filtered = cctvs.filter(c => c.id !== id);
    saveCustomCctvs(filtered);
    renderCustomCctvGrid();
    updateCameraCount();
}

// Close add CCTV modal on background click
document.getElementById('add-cctv-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('add-cctv-modal')) {
        closeAddCustomCctvModal();
    }
});

// Make functions available globally
window.openAddCustomCctvModal = openAddCustomCctvModal;
window.closeAddCustomCctvModal = closeAddCustomCctvModal;
window.submitAddCustomCctv = submitAddCustomCctv;
window.playCustomCctv = playCustomCctv;
window.deleteCustomCctv = deleteCustomCctv;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    renderCustomCctvGrid();
    updateCameraCount();
});
