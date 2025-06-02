FROM php:8.2-fpm

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libpq-dev \
    && docker-php-ext-install zip pdo pdo_pgsql

# Установка зависимостей проекта
WORKDIR /var/www/html
COPY . /var/www/html
