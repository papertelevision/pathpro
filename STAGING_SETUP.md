# PathPro Staging Site Setup Guide

## Server Information
- **Production Domain:** pathpro.co
- **Staging Domain:** staging.pathpro.co
- **Droplet IP:** 134.209.79.71
- **SSH User:** root
- **GitHub Repo:** https://github.com/papertelevision/pathpro

---

## Step 1: Connect to Your Server

```bash
ssh root@134.209.79.71
```

---

## Step 2: Create Staging Directory

```bash
# Create the staging directory
sudo mkdir -p /var/www/staging.pathpro.co

# Navigate to web root
cd /var/www
```

---

## Step 3: Clone Repository

```bash
# Clone your GitHub repository
git clone https://github.com/papertelevision/pathpro.git staging.pathpro.co

# Navigate into the directory
cd staging.pathpro.co

# Verify you're on the main branch
git branch
```

---

## Step 4: Set Proper Permissions

```bash
# Set ownership (replace 'www-data' with your web server user if different)
sudo chown -R www-data:www-data /var/www/staging.pathpro.co

# Set directory permissions
sudo find /var/www/staging.pathpro.co -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/staging.pathpro.co -type f -exec chmod 644 {} \;

# Set storage and cache permissions
sudo chmod -R 775 /var/www/staging.pathpro.co/storage
sudo chmod -R 775 /var/www/staging.pathpro.co/bootstrap/cache
```

---

## Step 5: Install PHP Dependencies

```bash
cd /var/www/staging.pathpro.co

# Install Composer dependencies (production optimized)
composer install --optimize-autoloader --no-dev
```

---

## Step 6: Create Staging Database

```bash
# Login to MySQL
mysql -u root -p

# In MySQL prompt, run:
CREATE DATABASE pathpro_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create database user for staging
CREATE USER 'pathpro_staging'@'localhost' IDENTIFIED BY 'CHOOSE_STRONG_PASSWORD_HERE';

# Grant privileges
GRANT ALL PRIVILEGES ON pathpro_staging.* TO 'pathpro_staging'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

**Important:** Replace `CHOOSE_STRONG_PASSWORD_HERE` with a strong password and save it!

---

## Step 7: Configure Environment File

```bash
cd /var/www/staging.pathpro.co

# Copy the example env file
cp .env.example .env

# Edit the .env file
nano .env
```

Update the following values in `.env`:

```env
APP_NAME="PathPro Staging"
APP_ENV=staging
APP_DEBUG=true
APP_URL=https://staging.pathpro.co

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pathpro_staging
DB_USERNAME=pathpro_staging
DB_PASSWORD=YOUR_DATABASE_PASSWORD_HERE

# Stripe keys (use test keys for staging)
STRIPE_KEY=your_stripe_test_publishable_key
STRIPE_SECRET=your_stripe_test_secret_key

# Mail settings (recommend using Mailtrap or similar for staging)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls

# Session and cache (use different prefix than production)
CACHE_PREFIX=staging_
SESSION_COOKIE=staging_pathpro_session
```

Save and exit (Ctrl+X, then Y, then Enter)

---

## Step 8: Generate Application Key

```bash
cd /var/www/staging.pathpro.co

# Generate Laravel application key
php artisan key:generate
```

---

## Step 9: Run Database Migrations

```bash
# Run migrations to set up database schema
php artisan migrate --force

# Optional: Seed database with test data
php artisan db:seed --force
```

---

## Step 10: Create Storage Link

```bash
# Create symbolic link for storage
php artisan storage:link
```

---

## Step 11: Install Node Dependencies and Build Assets

```bash
cd /var/www/staging.pathpro.co

# Install Node dependencies
npm install

# Build production assets
npm run production
```

---

## Step 12: Clear and Cache Configuration

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Step 13: Create Nginx Configuration

```bash
# Create Nginx config file
sudo nano /etc/nginx/sites-available/staging.pathpro.co
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name staging.pathpro.co;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name staging.pathpro.co;

    root /var/www/staging.pathpro.co/public;
    index index.php index.html index.htm;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/staging.pathpro.co/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/staging.pathpro.co/privkey.pem;

    # Logging
    access_log /var/log/nginx/staging.pathpro.co-access.log;
    error_log /var/log/nginx/staging.pathpro.co-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size
    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;  # Adjust PHP version if needed
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Save and exit.

---

## Step 14: Enable Nginx Site

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/staging.pathpro.co /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 15: Configure DNS

**In your domain registrar or DNS provider:**

1. Go to your DNS settings for `pathpro.co`
2. Add an A record:
   - **Type:** A
   - **Name:** staging
   - **Value:** 134.209.79.71
   - **TTL:** 3600 (or default)

Wait 5-10 minutes for DNS to propagate.

**Verify DNS:**
```bash
# On your local machine, run:
dig staging.pathpro.co

# Or:
nslookup staging.pathpro.co
```

---

## Step 16: Install SSL Certificate

```bash
# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d staging.pathpro.co

# Follow the prompts:
# - Enter your email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Test automatic renewal
sudo certbot renew --dry-run
```

---

## Step 17: Final Permission Check

```bash
# Ensure proper ownership
sudo chown -R www-data:www-data /var/www/staging.pathpro.co/storage
sudo chown -R www-data:www-data /var/www/staging.pathpro.co/bootstrap/cache

# Set proper permissions
sudo chmod -R 775 /var/www/staging.pathpro.co/storage
sudo chmod -R 775 /var/www/staging.pathpro.co/bootstrap/cache
```

---

## Step 18: Create Free Plan Test User on Staging

```bash
cd /var/www/staging.pathpro.co

# Run the command to create free plan and test user
php artisan app:create-free-plan-test-user
```

This will create:
- Free plan (1 project, no team members, no attachments)
- Test user: `freeuser@example.com` / `password`

---

## Step 19: Testing

### Test the Site
1. Visit: https://staging.pathpro.co
2. You should see the PathPro login page
3. Try logging in with test user: `freeuser@example.com` / `password`

### Check Logs if Issues Occur
```bash
# Laravel logs
tail -f /var/www/staging.pathpro.co/storage/logs/laravel.log

# Nginx error logs
tail -f /var/log/nginx/staging.pathpro.co-error.log

# PHP-FPM logs
tail -f /var/log/php8.1-fpm.log
```

---

## Ongoing Maintenance

### Deploying Updates from GitHub

When you push changes to GitHub and want to deploy to staging:

```bash
# SSH into server
ssh root@134.209.79.71

# Navigate to staging directory
cd /var/www/staging.pathpro.co

# Pull latest changes
git pull origin main

# Install/update dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run production

# Run migrations (if any)
php artisan migrate --force

# Clear and rebuild caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions
sudo chown -R www-data:www-data /var/www/staging.pathpro.co/storage
sudo chown -R www-data:www-data /var/www/staging.pathpro.co/bootstrap/cache
```

---

## Troubleshooting

### 502 Bad Gateway
- Check if PHP-FPM is running: `sudo systemctl status php8.1-fpm`
- Check Nginx error logs: `tail -f /var/log/nginx/staging.pathpro.co-error.log`

### 500 Internal Server Error
- Check Laravel logs: `tail -f /var/www/staging.pathpro.co/storage/logs/laravel.log`
- Verify `.env` file has correct database credentials
- Ensure storage permissions are correct

### Database Connection Issues
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check database credentials in `.env`
- Ensure MySQL is running: `sudo systemctl status mysql`

### Assets Not Loading
- Rebuild assets: `npm run production`
- Check file permissions
- Clear browser cache

---

## Security Notes

1. **Use Test Stripe Keys** on staging, never production keys
2. **Use Mailtrap or similar** for email testing to avoid sending real emails
3. **Keep APP_DEBUG=true** on staging for easier debugging
4. **Different Session Names** to avoid conflicts with production cookies
5. **Regular Backups** of staging database for important test data

---

## Quick Reference Commands

```bash
# Connect to server
ssh root@134.209.79.71

# Navigate to staging
cd /var/www/staging.pathpro.co

# Pull latest code
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear all caches
php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear

# Rebuild caches
php artisan config:cache && php artisan route:cache && php artisan view:cache

# View logs
tail -f storage/logs/laravel.log
```

---

**Setup Complete! 🎉**

Your staging site should now be accessible at: **https://staging.pathpro.co**
