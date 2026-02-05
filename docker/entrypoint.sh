#!/bin/sh
set -e

cd /var/www/html

# Generate app key if not set
if [ -z "$APP_KEY" ] && [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# If .env exists but APP_KEY is empty, generate it
if [ -f .env ] && ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Ensure storage directories exist and have correct permissions
mkdir -p storage/app/hls storage/framework/{cache,sessions,views} storage/logs bootstrap/cache database
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# Create SQLite database if not exists
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    chown www-data:www-data database/database.sqlite
fi

# Run migrations if needed
php artisan migrate --force --no-interaction 2>/dev/null || true

# Clear and cache config for production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Create supervisor log directory
mkdir -p /var/log/supervisor

echo "==================================="
echo "  CCTV App is starting..."
echo "  Access at: http://localhost:8080"
echo "==================================="

# Execute the main command
exec "$@"
