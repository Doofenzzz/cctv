# 🚀 Deploy CCTV App ke VPS - Panduan Lengkap

Panduan ini untuk deploy dari VPS yang baru dibuat (fresh install Ubuntu/Debian).

---

## 📋 Langkah 1: Siapkan VPS

### 1.1 Login ke VPS
```bash
ssh root@IP_VPS_KAMU
```

### 1.2 Update sistem
```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Jalankan Docker
systemctl enable docker
systemctl start docker

# Cek instalasi
docker --version
```

### 1.4 Install Docker Compose
```bash
apt install docker-compose-plugin -y

# Cek instalasi
docker compose version
```

---

## 📁 Langkah 2: Upload Project

### Opsi A: Dari Git (Recommended)
```bash
# Install git
apt install git -y

# Clone project
cd /var/www
git clone https://github.com/USERNAME/cctv.git
cd cctv
```

### Opsi B: Upload Manual via SCP
```bash
# DARI LAPTOP KAMU (bukan di VPS):
cd /path/to/project/cctv

# Buat archive (exclude node_modules & vendor)
tar --exclude='node_modules' --exclude='vendor' --exclude='.git' -czvf cctv.tar.gz .

# Upload ke VPS
scp cctv.tar.gz root@IP_VPS_KAMU:/var/www/

# DI VPS:
cd /var/www
mkdir cctv && cd cctv
tar -xzvf ../cctv.tar.gz
rm ../cctv.tar.gz
```

---

## 🐳 Langkah 3: Build & Jalankan

```bash
cd /var/www/cctv

# Build dan jalankan (proses ini bisa 2-5 menit)
docker compose up -d --build

# Cek status
docker compose ps

# Lihat logs (tekan Ctrl+C untuk keluar)
docker compose logs -f
```

---

## 🌐 Langkah 4: Akses Aplikasi

Aplikasi sudah jalan di: `http://IP_VPS_KAMU:8080`

---

## 🔒 Langkah 5: (Opsional) Setup Domain + HTTPS

### 5.1 Install Nginx sebagai Reverse Proxy
```bash
apt install nginx -y
```

### 5.2 Buat config untuk domain
```bash
nano /etc/nginx/sites-available/cctv
```

Paste ini:
```nginx
server {
    listen 80;
    server_name cctv.domain.com;  # Ganti dengan domain kamu

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Untuk WebSocket/streaming
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 5.3 Aktifkan config
```bash
ln -s /etc/nginx/sites-available/cctv /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 5.4 Install SSL dengan Certbot
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d cctv.domain.com
```

---

## 🔧 Troubleshooting

| Problem | Solusi |
|---------|--------|
| Port 8080 tidak bisa diakses | `ufw allow 8080` atau cek firewall VPS |
| Build error out of memory | Tambah swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` |
| Container restart terus | `docker compose logs app` untuk lihat error |
| Permission denied | `chmod -R 777 storage bootstrap/cache` |

---

## 📌 Command Berguna

```bash
# Restart container
docker compose restart

# Stop semua
docker compose down

# Update setelah pull code baru
docker compose up -d --build

# Masuk ke container
docker compose exec app sh

# Lihat resource usage
docker stats
```
