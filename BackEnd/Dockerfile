FROM php:8.2-apache

# Desactivar otros MPM y dejar solo prefork
RUN a2dismod mpm_event || true
RUN a2dismod mpm_worker || true
RUN a2enmod mpm_prefork

# Instalar extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiar archivos del backend
COPY . /var/www/html/

EXPOSE 80