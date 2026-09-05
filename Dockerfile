FROM php:8.2-apache

# Install system dependencies needed for intl extension
RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

# Enable required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite (required for CI4 routing)
RUN a2enmod rewrite

# Copy project files
COPY . /var/www/html/

# Set Apache's document root to CI4's public/ folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Allow .htaccess overrides
RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

# Fix permissions so CI4 can write to cache/logs/session
RUN chown -R www-data:www-data /var/www/html/writable \
    && chmod -R 775 /var/www/html/writable

# ---------------------------------------------------------------------------
# Render expects the web server to listen on the $PORT env var (default 10000).
# Apache's default is port 80, so re-point both the Listen line and the
# VirtualHost at container start. NOTE: the "${PORT:-80}" must be expanded by
# the shell, so it is placed OUTSIDE the single-quoted sed expressions
# (falls back to 80 when $PORT is not set, e.g. locally).
# ---------------------------------------------------------------------------
CMD ["sh", "-c", "sed -ri 's/^Listen 80$/Listen '\"${PORT:-80}\"'/' /etc/apache2/ports.conf; sed -ri 's/^<VirtualHost \\*:80>$/<VirtualHost *:'\"${PORT:-80}\"'>/' /etc/apache2/sites-available/000-default.conf; exec apache2-foreground"]

WORKDIR /var/www/html