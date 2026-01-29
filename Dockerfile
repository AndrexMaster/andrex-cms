FROM php:8.2-fpm

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

## Установка необходимых системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev unzip git curl libpq-dev \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    libwebp-dev libxpm-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Компиляция GD с явными путями
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install -j$(nproc) gd

# Установка расширений PHP
# Разделим на отдельные шаги для лучшей диагностики
RUN docker-php-ext-install -j$(nproc) zip pdo
RUN docker-php-ext-install -j$(nproc) pdo_pgsql # Отдельный шаг для pdo_pgsql

# Установка зависимостей проекта
WORKDIR /var/www/html
COPY . /var/www/html

RUN mkdir -p storage/framework/sessions \
             storage/framework/views \
             storage/framework/cache \
             bootstrap/cache

RUN chmod -R 775 storage bootstrap/cache

RUN composer install --no-dev --optimize-autoloader --no-scripts

RUN php artisan package:discover --ansi