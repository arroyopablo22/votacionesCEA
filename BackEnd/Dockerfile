FROM php:8.2-apache

# Instalar driver PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copiar archivos del backend
COPY . /var/www/html/

# Habilitar mod_rewrite
RUN a2enmod rewrite

EXPOSE 80