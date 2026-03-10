FROM php:8.2-cli

# instalar driver PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# carpeta de trabajo
WORKDIR /app

# copiar backend
COPY . .

# iniciar servidor php
CMD php -S 0.0.0.0:$PORT