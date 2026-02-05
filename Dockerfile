# Build assets
FROM node:20-alpine AS node-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# PHP Application
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    ffmpeg \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    sqlite \
    sqlite-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip gd pcntl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application code first
COPY . .

# Copy built assets from node stage
COPY --from=node-builder /app/public/build ./public/build

# Install PHP dependencies with increased memory
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction

# Setup directories and permissions
RUN mkdir -p storage/app/hls \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    database \
    && touch database/database.sqlite \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache database

# Copy Docker configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
