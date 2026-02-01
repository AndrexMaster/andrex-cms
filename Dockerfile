# --- ЭТАП 1: Сборка фронтенда (Node.js) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ЭТАП 2: Основной образ (PHP) ---
FROM php:8.2-fpm

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev unzip git curl libpq-dev \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    libwebp-dev libxpm-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка расширений PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) zip pdo pdo_pgsql

WORKDIR /var/www/html
COPY . /var/www/html

# Копируем собранный фронтенд из первого этапа
# Это заменяет необходимость устанавливать npm в этом образе
COPY --from=frontend-builder /app/public/build ./public/build

# Настройка прав и папок
RUN mkdir -p storage/framework/sessions \
             storage/framework/views \
             storage/framework/cache \
             bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data /var/www/html

# Установка PHP зависимостей
RUN composer install --no-dev --optimize-autoloader --no-scripts

RUN php artisan package:discover --ansi

ENTRYPOINT ["sh", "./entrypoint.sh"]