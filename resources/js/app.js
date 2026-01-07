// CCTV Data for Pekanbaru - Using local proxy to bypass CORS
const cctvData = [
    {
        id: 1,
        name: "Sudirman - Gajah Mada 1",
        location: "Simpang Jl. Sudirman - Jl. Gajah Mada",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5071,
        lng: 101.4478,
        status: "stabil",
        camId: 1
    },
    {
        id: 15,
        name: "Sudirman - Harapan Raya",
        location: "Simpang Jl. Sudirman - Jl. Harapan Raya",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5095,
        lng: 101.4625,
        status: "stabil",
        camId: 15
    },
    {
        id: 16,
        name: "Sudirman - Harapan Raya 1",
        location: "Jl. Sudirman arah Harapan Raya",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5098,
        lng: 101.4632,
        status: "stabil",
        camId: 16
    },
    {
        id: 18,
        name: "JPO MTQ 1",
        location: "Jembatan Penyeberangan Orang MTQ",
        area: "MTQ",
        areaSlug: "mtq",
        lat: 0.4892,
        lng: 101.4156,
        status: "stabil",
        camId: 18
    },
    {
        id: 19,
        name: "JPO MTQ 2",
        location: "Jembatan Penyeberangan Orang MTQ",
        area: "MTQ",
        areaSlug: "mtq",
        lat: 0.4895,
        lng: 101.4160,
        status: "stabil",
        camId: 19
    },
    {
        id: 21,
        name: "Sudirman - Tengku Bey 1",
        location: "Simpang Jl. Sudirman - Jl. Tengku Bey",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5133,
        lng: 101.4245,
        status: "stabil",
        camId: 21
    },
    {
        id: 22,
        name: "Sudirman - Tengku Bey 2",
        location: "Jl. Sudirman dekat Jl. Tengku Bey",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5135,
        lng: 101.4248,
        status: "stabil",
        camId: 22
    },
    {
        id: 23,
        name: "Sudirman - Tengku Bey 3",
        location: "Jl. Sudirman - Tengku Bey",
        area: "Sudirman",
        areaSlug: "sudirman",
        lat: 0.5137,
        lng: 101.4250,
        status: "stabil",
        camId: 23
    },
    {
        id: 25,
        name: "Tuanku Tambusai - Paus 1",
        location: "Simpang Jl. Tuanku Tambusai - Jl. Paus",
        area: "Tuanku Tambusai",
        areaSlug: "tuanku-tambusai",
        lat: 0.5045,
        lng: 101.4521,
        status: "stabil",
        camId: 25
    },
    {
        id: 26,
        name: "Tuanku Tambusai - Paus 2",
        location: "Jl. Tuanku Tambusai dekat Jl. Paus",
        area: "Tuanku Tambusai",
        areaSlug: "tuanku-tambusai",
        lat: 0.5048,
        lng: 101.4525,
        status: "stabil",
        camId: 26
    },
    {
        id: 40,
        name: "Simpang Garuda Sakti 1",
        location: "Simpang Jl. Garuda Sakti",
        area: "Garuda Sakti",
        areaSlug: "garuda-sakti",
        lat: 0.4750,
        lng: 101.3920,
        status: "stabil",
        camId: 40
    },
    {
        id: 54,
        name: "Stadion Rumbai 1",
        location: "Stadion Rumbai",
        area: "Rumbai",
        areaSlug: "rumbai",
        lat: 0.5650,
        lng: 101.4100,
        status: "stabil",
        camId: 54
    },
    {
        id: 55,
        name: "Stadion Rumbai 2",
        location: "Stadion Rumbai",
        area: "Rumbai",
        areaSlug: "rumbai",
        lat: 0.5652,
        lng: 101.4102,
        status: "stabil",
        camId: 55
    },
    {
        id: 56,
        name: "Stadion Rumbai 3",
        location: "Stadion Rumbai",
        area: "Rumbai",
        areaSlug: "rumbai",
        lat: 0.5654,
        lng: 101.4104,
        status: "stabil",
        camId: 56
    },
    {
        id: 58,
        name: "Sembilang - Sekolah 1",
        location: "Jl. Sembilang - Dekat Sekolah",
        area: "Sembilang",
        areaSlug: "sembilang",
        lat: 0.5201,
        lng: 101.4089,
        status: "stabil",
        camId: 58
    },
    {
        id: 59,
        name: "Sembilang - Sekolah 2",
        location: "Jl. Sembilang - Area Sekolah",
        area: "Sembilang",
        areaSlug: "sembilang",
        lat: 0.5203,
        lng: 101.4091,
        status: "stabil",
        camId: 59
    },
    {
        id: 60,
        name: "Sembilang - Sekolah 3",
        location: "Jl. Sembilang",
        area: "Sembilang",
        areaSlug: "sembilang",
        lat: 0.5205,
        lng: 101.4093,
        status: "stabil",
        camId: 60
    },
    {
        id: 66,
        name: "Rumah Singgah Tuan Kadi 1",
        location: "Rumah Singgah Tuan Kadi",
        area: "Tuan Kadi",
        areaSlug: "tuan-kadi",
        lat: 0.5300,
        lng: 101.4400,
        status: "stabil",
        camId: 66
    },
    {
        id: 69,
        name: "Rumah Singgah Tuan Kadi 4",
        location: "Rumah Singgah Tuan Kadi",
        area: "Tuan Kadi",
        areaSlug: "tuan-kadi",
        lat: 0.5303,
        lng: 101.4403,
        status: "stabil",
        camId: 69
    },
    {
        id: 7,
        name: "Depan MPP 1",
        location: "Depan Mal Pelayanan Publik",
        area: "MPP",
        areaSlug: "mpp",
        lat: 0.5080,
        lng: 101.4460,
        status: "offline",
        camId: 7
    }
];

// Helper function to get stream URL via proxy
function getStreamUrl(camId) {
    return `/api/cctv/stream/${camId}/index.m3u8`;
}

let map;
let markers = [];
let infoWindow;

// Initialize Google Maps
function initMap() {
    const pekanbaru = { lat: 0.5071, lng: 101.4478 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: pekanbaru,
        styles: getMapStyles(),
        disableDefaultUI: true,
        zoomControl: false,
    });

    infoWindow = new google.maps.InfoWindow();

    // Add markers
    addMarkers(cctvData);

    // Setup zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        map.setZoom(map.getZoom() + 1);
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        map.setZoom(map.getZoom() - 1);
    });
}

// Add CCTV markers to map
function addMarkers(data) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    data.forEach(cctv => {
        const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getStatusColor(cctv.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 12,
        };

        // Create custom marker with camera icon
        const marker = new google.maps.Marker({
            position: { lat: cctv.lat, lng: cctv.lng },
            map: map,
            icon: {
                url: createMarkerSVG(cctv.status),
                scaledSize: new google.maps.Size(36, 42),
                anchor: new google.maps.Point(18, 42),
            },
            title: cctv.name,
        });

        // Click event
        marker.addListener('click', () => {
            openCCTVModal(cctv);
        });

        // Hover event for info window
        marker.addListener('mouseover', () => {
            infoWindow.setContent(`
                <div style="padding: 8px; color: #1e293b;">
                    <strong>${cctv.name}</strong><br>
                    <small>${cctv.location}</small>
                </div>
            `);
            infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
            infoWindow.close();
        });

        markers.push({ marker, data: cctv });
    });

    updateStatusCounts(data);
}

// Create marker SVG based on status
function createMarkerSVG(status) {
    const color = getStatusColor(status);
    const svg = `
        <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 24 18 24s18-10.5 18-24C36 8.059 27.941 0 18 0z" fill="${color}"/>
            <circle cx="18" cy="18" r="10" fill="white"/>
            <path d="M14 14l4 2v4l-4 2v-8zM18 16h4v4h-4v-4z" fill="${color}"/>
        </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// Get color based on status
function getStatusColor(status) {
    const colors = {
        stabil: '#22c55e',
        tunnel: '#f97316',
        offline: '#64748b',
        perbaikan: '#ef4444'
    };
    return colors[status] || colors.stabil;
}

// Update status counts
function updateStatusCounts(data) {
    const stabil = data.filter(c => c.status === 'stabil').length;
    const tunnel = data.filter(c => c.status === 'tunnel').length;

    document.getElementById('stabil-count').textContent = stabil;
    document.getElementById('tunnel-count').textContent = tunnel;
    document.getElementById('online-count').textContent = stabil + tunnel;
    document.getElementById('camera-count').textContent = data.length;
}

// Global HLS player instance
let hlsPlayer = null;

// Open CCTV Modal
function openCCTVModal(cctv) {
    const modal = document.getElementById('cctv-modal');
    const video = document.getElementById('cctv-video');

    // Update modal content
    document.getElementById('modal-title').textContent = cctv.name;
    document.getElementById('modal-camera-name').textContent = cctv.name.toUpperCase();
    document.getElementById('modal-location').textContent = cctv.location;
    document.getElementById('modal-area').textContent = cctv.area.toUpperCase();
    document.getElementById('modal-status').textContent = capitalizeFirst(cctv.status);

    // Update status indicator color
    const statusIndicator = document.getElementById('modal-status');
    statusIndicator.style.background = `rgba(${getStatusRGB(cctv.status)}, 0.15)`;
    statusIndicator.style.color = getStatusColor(cctv.status);

    // Destroy previous HLS instance if exists
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }

    // Get stream URL via proxy
    const streamUrl = getStreamUrl(cctv.camId);

    // Use HLS.js for .m3u8 streams
    if (Hls.isSupported()) {
        hlsPlayer = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });
        hlsPlayer.loadSource(streamUrl);
        hlsPlayer.attachMedia(video);
        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
        hlsPlayer.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                console.error('HLS Error:', data);
                // Show offline message
                document.getElementById('modal-status').textContent = 'Offline';
                document.getElementById('modal-status').style.color = '#64748b';
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }

    // Show modal
    modal.classList.add('active');

    // Update timestamp
    updateModalTimestamp();
}

// Get status RGB values
function getStatusRGB(status) {
    const rgb = {
        stabil: '34, 197, 94',
        tunnel: '249, 115, 22',
        offline: '100, 116, 139',
        perbaikan: '239, 68, 68'
    };
    return rgb[status] || rgb.stabil;
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close modal
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('cctv-modal');
    const video = document.getElementById('cctv-video');
    video.pause();

    // Destroy HLS player if exists
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }

    modal.classList.remove('active');
});

// Close modal on background click
document.getElementById('cctv-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('cctv-modal')) {
        document.getElementById('close-modal').click();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('close-modal').click();
    }
});

// Update modal timestamp
function updateModalTimestamp() {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('modal-timestamp').textContent = formatted;
}

// Real-time clock
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = time;
}

setInterval(updateClock, 1000);
updateClock();

// Area filter
document.getElementById('area-filter').addEventListener('change', (e) => {
    const value = e.target.value;
    let filteredData = cctvData;

    if (value !== 'all') {
        filteredData = cctvData.filter(c => c.areaSlug === value);
    }

    addMarkers(filteredData);

    // Update dropdown text
    const count = filteredData.length;
    const areaName = value === 'all' ? 'Pekanbaru' : capitalizeFirst(value.replace('-', ' '));
    e.target.options[e.target.selectedIndex].text = `${areaName} (${count})`;
});

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    if (!query) {
        addMarkers(cctvData);
        return;
    }

    const filtered = cctvData.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.area.toLowerCase().includes(query)
    );

    addMarkers(filtered);
});

// Keyboard shortcut for search
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});

// View toggle
document.getElementById('map-view-btn').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('grid-view-btn').classList.remove('active');
    document.getElementById('map-view').classList.remove('hidden');
    document.getElementById('grid-view').classList.add('hidden');
});

document.getElementById('grid-view-btn').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('map-view-btn').classList.remove('active');
    document.getElementById('grid-view').classList.remove('hidden');
    document.getElementById('map-view').classList.add('hidden');
    renderGridView();
});

// Render grid view
function renderGridView() {
    const grid = document.getElementById('grid-view');
    grid.innerHTML = cctvData.map(cctv => `
        <div class="glass-card p-4 cursor-pointer hover:border-blue-500 transition" onclick="openCCTVModal(${JSON.stringify(cctv).replace(/"/g, '&quot;')})">
            <div class="relative aspect-video bg-slate-800 rounded-lg mb-3 overflow-hidden">
                <video class="w-full h-full object-cover" muted loop>
                    <source src="${cctv.streamUrl}" type="video/mp4">
                </video>
                <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 rounded text-xs font-medium" style="background: ${getStatusColor(cctv.status)}20; color: ${getStatusColor(cctv.status)}">
                        ${capitalizeFirst(cctv.status)}
                    </span>
                </div>
            </div>
            <h3 class="font-semibold mb-1">${cctv.name}</h3>
            <p class="text-sm text-slate-400">${cctv.location}</p>
        </div>
    `).join('');

    // Play videos on hover
    grid.querySelectorAll('.glass-card').forEach(card => {
        const video = card.querySelector('video');
        card.addEventListener('mouseenter', () => video.play());
        card.addEventListener('mouseleave', () => video.pause());
    });
}

// Expose openCCTVModal to global scope for grid view onclick
window.openCCTVModal = openCCTVModal;

// Map styles for dark theme
function getMapStyles() {
    return [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
        }
    ];
}

// Make initMap available globally
window.initMap = initMap;
