FROM php:8.2-apache

# copiar archivos del backend
COPY . /var/www/html/

# instalar extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# habilitar mod_rewrite
RUN a2enmod rewrite

EXPOSE 80