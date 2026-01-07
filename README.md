# CCTV PKU - Pekanbaru CCTV Monitoring

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

Aplikasi monitoring CCTV publik Kota Pekanbaru secara real-time. Menampilkan 20+ kamera CCTV dari berbagai lokasi dengan tampilan peta interaktif.

![Preview](https://via.placeholder.com/800x400?text=CCTV+PKU+Preview)

## ✨ Fitur

- 🗺️ **Peta Interaktif** - Google Maps dengan marker lokasi CCTV
- 📹 **Live Streaming** - HLS streaming langsung dari kamera
- 🔍 **Pencarian** - Cari CCTV berdasarkan nama atau lokasi
- 🎨 **Dark Theme** - UI modern dengan dark mode
- 📱 **Responsive** - Tampilan optimal di desktop & mobile

## 🛠️ Tech Stack

- **Backend**: Laravel 11
- **Frontend**: Blade + Vite + Tailwind CSS 4
- **Streaming**: HLS.js
- **Maps**: Google Maps JavaScript API

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/username/cctv-pku.git
cd cctv-pku

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Build assets
npm run build
```

### Running Locally

```bash
# Development (with hot reload)
npm run dev

# In another terminal
php artisan serve
```

Buka http://localhost:8000

### Production Build

```bash
npm run build
```

## 📁 Struktur Project

```
cctv/
├── app/Http/Controllers/
│   └── CctvProxyController.php  # Proxy untuk bypass CORS
├── resources/
│   ├── views/welcome.blade.php  # Main view
│   ├── js/app.js                # JavaScript (maps, modals)
│   └── css/app.css              # Tailwind styles
├── routes/web.php               # Routes
└── public/                      # Static assets
```

## 🔧 Konfigurasi

### Google Maps API Key

Edit `resources/views/welcome.blade.php`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
```

### Menambah CCTV Baru

Edit array `cctvData` di `resources/js/app.js`:

```javascript
{
    id: 99,
    name: "Nama CCTV",
    location: "Alamat Lokasi",
    area: "Area",
    areaSlug: "area-slug",
    lat: 0.5071,
    lng: 101.4478,
    status: "stabil", // stabil | tunnel | offline | perbaikan
    camId: 99 // ID kamera dari server CCTV
}
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cctv/stream/{camId}/index.m3u8` | HLS playlist |
| GET | `/api/cctv/stream/{camId}/{file}.ts` | Video segment |

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu.

## 📄 License

[MIT](LICENSE)

---

Made with ❤️ for Pekanbaru
