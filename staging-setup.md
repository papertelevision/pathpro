# Staging Environment Setup Guide

This guide will help you set up a complete staging environment on your Digital Ocean droplet for safe testing before production deployment.

---

## Why Use a Staging Environment?

✅ **Test safely** - Catch issues before they affect production users
✅ **Verify updates** - Ensure all changes work as expected
✅ **Practice deployments** - Perfect the deployment process
✅ **No risk to production data** - Database and users remain untouched

---

## Quick Setup (10 Commands)

If you're experienced with Linux, here's the quick version:

```bash
# 1. Clone repository
cd /var/www
git clone https://github.com/YOUR-USERNAME/pathpro.git pathpro-staging
cd pathpro-staging
git checkout ui-updates-2025

# 2. Copy and edit .env
cp /var/www/pathpro/.env .env
nano .env  # Update APP_URL, DB_DATABASE to staging values

# 3. Install dependencies
composer install --optimize-autoloader
npm install && npm run production

# 4. Setup application
php artisan key:generate
php artisan storage:link
php artisan migrate --force
php artisan optimize

# 5. Set permissions
chown -R www-data:www-data /var/www/pathpro-staging
chmod -R 775 storage bootstrap/cache

# 6. Configure Nginx (see detailed steps below)

# 7. Enable SSL
certbot --nginx -d staging.yourdomain.com
```

---

## Detailed Setup Instructions

### Prerequisites

Before starting, gather this information:

- [ ] Digital Ocean droplet IP address or domain
- [ ] SSH login credentials (root or sudo user)
- [ ] GitHub repository URL
- [ ] Production database credentials
- [ ] Your domain name

### Step 1: Connect to Your Droplet

**On macOS/Linux:**
```bash
ssh root@your-droplet-ip
```

**On Windows:**
- Use PuTTY or Windows Terminal
- Enter your droplet IP and port 22
- Login with root credentials

### Step 2: Verify Existing Setup

```bash
# Check current web root location
ls -la /var/www/

# You should see your production directory (e.g., 'pathpro' or 'html')
# Note the exact name - you'll need it later
```

### Step 3: Clone Repository for Staging

```bash
# Navigate to web root
cd /var/www

# Clone your repository
# Replace YOUR-USERNAME with your GitHub username
# Replace pathpro with your repository name if different
git clone https://github.com/YOUR-USERNAME/pathpro.git pathpro-staging

# Enter the staging directory
cd pathpro-staging

# List available branches
git branch -a

# Checkout your UI updates branch
git checkout ui-updates-2025

# Verify you're on the correct branch
git status
```

You should see: "On branch ui-updates-2025"

### Step 4: Create Staging Environment File

```bash
# Copy production .env file
# Adjust 'pathpro' to match your production directory name
cp /var/www/pathpro/.env /var/www/pathpro-staging/.env

# Edit the staging .env file
nano /var/www/pathpro-staging/.env
```

**Make these changes in the .env file:**

1. Find and update these lines:
```env
APP_NAME="PathPro Staging"
APP_ENV=staging
APP_DEBUG=true
APP_URL=https://staging.yourdomain.com
```

2. Update database settings:
```env
DB_DATABASE=pathpro_staging
```

3. Update session/domain settings:
```env
SESSION_DOMAIN=.staging.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=staging.yourdomain.com,*.staging.yourdomain.com
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 5: Create Staging Database

```bash
# Login to MySQL
mysql -u root -p
```

Enter your MySQL root password when prompted.

**In the MySQL prompt, run these commands:**

```sql
-- Create staging database
CREATE DATABASE pathpro_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges to your database user
-- Replace 'your_db_user' with your actual database username
GRANT ALL PRIVILEGES ON pathpro_staging.* TO 'your_db_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

You should see `pathpro_staging` in the database list.

### Step 6: Copy Production Data to Staging (Recommended)

This allows you to test with real data without affecting production.

```bash
# Dump production database
# Replace 'pathpro_production' with your actual production database name
mysqldump -u your_db_user -p pathpro_production > /tmp/production_data.sql

# Enter your database password when prompted

# Import into staging database
mysql -u your_db_user -p pathpro_staging < /tmp/production_data.sql

# Clean up the dump file
rm /tmp/production_data.sql
```

### Step 7: Install PHP Dependencies

```bash
# Make sure you're in the staging directory
cd /var/www/pathpro-staging

# Install Composer dependencies
composer install --optimize-autoloader

# This may take 1-2 minutes
```

You should see: "Package manifest generated successfully."

### Step 8: Install Node Dependencies and Build Assets

```bash
# Install NPM packages
npm install

# This may take 2-3 minutes

# Build production assets
npm run production
```

Wait for webpack to finish. You should see:
```
✔ Compiled Successfully in XXXXms
```

### Step 9: Setup Laravel Application

```bash
# Generate application key (if needed)
php artisan key:generate

# Create symbolic link for file storage
php artisan storage:link

# Run database migrations
php artisan migrate --force

# Optimize application for production
php artisan optimize
```

All commands should complete without errors.

### Step 10: Set File Permissions

```bash
# Set ownership to web server user
# Use 'www-data' for Nginx/Apache on Ubuntu
# Use 'nginx' if using Nginx on CentOS
chown -R www-data:www-data /var/www/pathpro-staging

# Set directory permissions
find /var/www/pathpro-staging -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/pathpro-staging -type f -exec chmod 644 {} \;

# Make storage and cache writable
chmod -R 775 /var/www/pathpro-staging/storage
chmod -R 775 /var/www/pathpro-staging/bootstrap/cache
```

### Step 11: Configure DNS for Staging Subdomain

**Before configuring Nginx, set up DNS:**

1. **Login to your domain registrar** (where you bought your domain)

2. **Add an A record:**
   - Type: `A`
   - Name: `staging`
   - Value: Your Digital Ocean droplet IP address
   - TTL: `3600` (or default)

3. **Wait 5-10 minutes** for DNS to propagate

4. **Verify DNS is working:**
```bash
# On your local machine, run:
ping staging.yourdomain.com

# You should see your droplet IP address
```

### Step 12: Configure Nginx for Staging

```bash
# Create new Nginx site configuration
nano /etc/nginx/sites-available/pathpro-staging
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name staging.yourdomain.com *.staging.yourdomain.com;

    root /var/www/pathpro-staging/public;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    charset utf-8;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Don't log favicon and robots requests
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Handle 404 errors
    error_page 404 /index.php;

    # PHP-FPM configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Deny access to hidden files
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Note:** If using PHP 8.2, change `php8.1-fpm.sock` to `php8.2-fpm.sock`

**Save and exit** (`Ctrl+X`, `Y`, `Enter`)

**Enable the site:**

```bash
# Create symbolic link to enable site
ln -s /etc/nginx/sites-available/pathpro-staging /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t
```

You should see:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

If successful, reload Nginx:

```bash
systemctl reload nginx
```

### Step 13: Install SSL Certificate (HTTPS)

```bash
# Install Certbot if not already installed
apt-get update
apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d staging.yourdomain.com -d *.staging.yourdomain.com
```

**Follow the prompts:**
- Enter your email address
- Agree to terms of service
- Choose whether to share email with EFF (optional)
- Select option 2: "Redirect - Make all requests redirect to secure HTTPS access"

**Verify SSL is working:**

Visit `https://staging.yourdomain.com` in your browser. You should see a padlock icon indicating secure connection.

---

## Testing Your Staging Environment

### 1. Access Staging Site

Open browser and go to: `https://staging.yourdomain.com`

You should see your PathPro application.

### 2. Test Login

- Try logging in with your admin credentials
- Verify you can access admin areas

### 3. Verify UI Updates

Check all the UI changes you made:

- [ ] Button styling (Add New buttons, Share icon)
- [ ] Pagination visibility
- [ ] Modal styling (News and Release Notes)
- [ ] Filter icons on roadmap
- [ ] Public view buttons (Project News, Submit Feedback)

### 4. Check Browser Console

- Open DevTools (F12)
- Look for any errors in Console tab
- Verify all CSS/JS files load correctly in Network tab

### 5. Test Key Functionality

- [ ] Create a new task
- [ ] Edit a task
- [ ] Add a comment
- [ ] Test feature voting
- [ ] Upload an image/file

---

## Maintaining Staging Environment

### Pulling Latest Updates

When you make more changes and push to GitHub:

```bash
cd /var/www/pathpro-staging
git pull origin ui-updates-2025
npm run production
php artisan optimize:clear
php artisan optimize
```

### Syncing Production Data to Staging

To refresh staging with latest production data:

```bash
# Dump production database
mysqldump -u your_db_user -p pathpro_production > /tmp/prod_data.sql

# Drop and recreate staging database
mysql -u your_db_user -p -e "DROP DATABASE pathpro_staging; CREATE DATABASE pathpro_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import production data
mysql -u your_db_user -p pathpro_staging < /tmp/prod_data.sql

# Clean up
rm /tmp/prod_data.sql

# Run any new migrations
cd /var/www/pathpro-staging
php artisan migrate --force
```

### Viewing Logs

```bash
# View Laravel application logs
tail -f /var/www/pathpro-staging/storage/logs/laravel.log

# Press Ctrl+C to stop

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### "502 Bad Gateway" Error

```bash
# Check PHP-FPM status
systemctl status php8.1-fpm

# Restart PHP-FPM if needed
systemctl restart php8.1-fpm

# Restart Nginx
systemctl restart nginx
```

### "Permission Denied" Errors

```bash
# Reset permissions
chown -R www-data:www-data /var/www/pathpro-staging
chmod -R 775 /var/www/pathpro-staging/storage
chmod -R 775 /var/www/pathpro-staging/bootstrap/cache
```

### Assets Not Loading

```bash
cd /var/www/pathpro-staging
npm run production
php artisan optimize:clear
php artisan optimize
```

### Database Connection Error

```bash
# Verify database credentials in .env
nano /var/www/pathpro-staging/.env

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

### Subdomain Not Working

```bash
# Verify Nginx configuration
nginx -t

# Check if site is enabled
ls -la /etc/nginx/sites-enabled/ | grep staging

# Reload Nginx
systemctl reload nginx

# Check DNS
ping staging.yourdomain.com
```

---

## Next Steps

Once staging is working correctly:

1. ✅ **Thoroughly test all UI changes**
2. ✅ **Test on different browsers** (Chrome, Firefox, Safari)
3. ✅ **Test on mobile devices**
4. ✅ **Verify no console errors**
5. ✅ **Get approval from stakeholders** if applicable

When everything looks good on staging:

📖 **Follow deployment-guide.md** to deploy to production

---

## Summary

You now have:
- ✅ Separate staging environment at staging.yourdomain.com
- ✅ Copy of production data for realistic testing
- ✅ SSL certificate for secure testing
- ✅ Safe environment to test changes without affecting production

This staging environment can be reused for all future updates, making your deployment process safer and more reliable.
