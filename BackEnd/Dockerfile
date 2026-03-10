FROM php:8.2-apache

# Instalar dependencias para PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev

# Instalar extensiones PHP
RUN docker-php-ext-install pdo pdo_pgsql

# Asegurar que solo esté activo prefork
RUN a2dismod mpm_event || true
RUN a2dismod mpm_worker || true
RUN a2enmod mpm_prefork

# Copiar backend
COPY . /var/www/html/

EXPOSE 80