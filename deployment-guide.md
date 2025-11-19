# PathPro Deployment Guide - UI Updates 2025

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] SSH access to your Digital Ocean droplet
- [ ] GitHub repository access
- [ ] Database credentials for production and staging
- [ ] Your domain configured with wildcard DNS (*.yourdomain.com)

---

## Phase 1: Local Preparation

### Step 1: Create and Push Branch

1. **Open GitHub Desktop**
   - Make sure you're in the PathPro repository

2. **Create New Branch**
   - Click "Current Branch" dropdown
   - Click "New Branch"
   - Name it: `ui-updates-2025`
   - Click "Create Branch"

3. **Verify All Changes Are Committed**
   - You should see "No local changes" in GitHub Desktop
   - If you see uncommitted changes, commit them:
     - Add a commit message: "UI updates: buttons, pagination, modals, filters"
     - Click "Commit to ui-updates-2025"

4. **Push Branch to GitHub**
   - Click "Publish branch" or "Push origin"
   - Wait for upload to complete

### Step 2: Verify on GitHub

1. Visit your GitHub repository in browser
2. Switch to `ui-updates-2025` branch
3. Confirm you see your recent commits

---

## Phase 2: Staging Environment Setup

### Step 1: Connect to Digital Ocean Droplet

```bash
# Replace with your droplet IP or domain
ssh root@your-droplet-ip
# Or
ssh your-username@your-domain.com
```

### Step 2: Check Current Setup

```bash
# Navigate to your production directory
cd /var/www

# List current directories
ls -la

# Note your production directory name (likely 'pathpro' or 'html')
```

### Step 3: Clone Repository for Staging

```bash
# Still in /var/www directory
git clone https://github.com/YOUR-USERNAME/pathpro.git pathpro-staging

# Navigate into staging directory
cd pathpro-staging

# Checkout your UI updates branch
git checkout ui-updates-2025

# Verify you're on the correct branch
git branch
```

### Step 4: Copy Environment File

```bash
# Copy production .env to staging (replace 'pathpro' with your production directory name)
cp /var/www/pathpro/.env /var/www/pathpro-staging/.env

# Edit staging .env file
nano /var/www/pathpro-staging/.env
```

**In the .env file, update these lines:**
```env
APP_ENV=staging
APP_DEBUG=true  # For testing only, set to false later
APP_URL=https://staging.yourdomain.com

# Create a separate staging database
DB_DATABASE=pathpro_staging
```

Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.

### Step 5: Create Staging Database

```bash
# Login to MySQL
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE pathpro_staging;
GRANT ALL PRIVILEGES ON pathpro_staging.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 6: Copy Production Data to Staging (Optional but Recommended)

```bash
# Dump production database
mysqldump -u your_db_user -p pathpro_production > production_data.sql

# Import into staging
mysql -u your_db_user -p pathpro_staging < production_data.sql

# Clean up dump file
rm production_data.sql
```

### Step 7: Install Dependencies

```bash
# Make sure you're in staging directory
cd /var/www/pathpro-staging

# Install PHP dependencies
composer install --optimize-autoloader

# Install Node dependencies
npm install

# Build production assets
npm run production
```

This will take 2-5 minutes. You'll see:
- Composer installing packages
- NPM installing dependencies
- Webpack compiling assets

### Step 8: Setup Application

```bash
# Generate application key (if needed)
php artisan key:generate

# Create storage link
php artisan storage:link

# Run migrations (ensure database is up to date)
php artisan migrate --force

# Optimize application
php artisan optimize
```

### Step 9: Set Correct Permissions

```bash
# Set ownership (replace www-data if your web server uses different user)
chown -R www-data:www-data /var/www/pathpro-staging

# Set directory permissions
find /var/www/pathpro-staging -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/pathpro-staging -type f -exec chmod 644 {} \;

# Ensure storage and cache are writable
chmod -R 775 /var/www/pathpro-staging/storage
chmod -R 775 /var/www/pathpro-staging/bootstrap/cache
```

### Step 10: Configure Nginx for Staging Subdomain

Create a new Nginx configuration file:

```bash
nano /etc/nginx/sites-available/pathpro-staging
```

**Paste this configuration (adjust paths and domain):**

```nginx
server {
    listen 80;
    server_name staging.yourdomain.com;
    root /var/www/pathpro-staging/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

**Enable the site:**

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/pathpro-staging /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# If test passes, reload Nginx
systemctl reload nginx
```

### Step 11: Setup SSL for Staging (Optional but Recommended)

```bash
# Using Certbot (Let's Encrypt)
certbot --nginx -d staging.yourdomain.com

# Follow prompts, choose to redirect HTTP to HTTPS
```

---

## Phase 3: Testing on Staging

### Checklist

Access `https://staging.yourdomain.com` and test:

- [ ] **Login works** - Try logging in as admin/team member
- [ ] **Roadmap view**
  - [ ] "Add New" dropdown styled correctly (#d2dce2 background, 0.5px border)
  - [ ] Share icon styled correctly and has 6px right margin
  - [ ] Eyeball icon is white (not gray) on task groups
  - [ ] Task group pagination hidden until 10+ entries
- [ ] **Feature Voting**
  - [ ] "Project News" button styled (#e1eaf0 background, 0.5px border)
  - [ ] "Submit Feedback" button styled
  - [ ] Pagination hidden until 10+ entries
- [ ] **News & Release Notes**
  - [ ] Edit modal matches Add modal styling
  - [ ] "Add New" button styled correctly
  - [ ] Pagination hidden until 10+ entries
- [ ] **Team Members / Community Members**
  - [ ] Pagination hidden until 10+ entries (top and bottom)
  - [ ] Table headers have #cad5db background
  - [ ] Ban member alert text flows correctly (no line break)
- [ ] **Projects Section**
  - [ ] "Add New" button has border (not "no-border")
- [ ] **Public View (log out and test)**
  - [ ] "Project News" and "Submit Feedback" buttons styled correctly
  - [ ] Share icon has proper spacing

### Check Browser Console

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - all CSS/JS files should load (200 status)

### Mobile Testing

Test on mobile device or use browser DevTools device emulation:
- [ ] Buttons render correctly on mobile
- [ ] Pagination works on mobile
- [ ] No horizontal scrolling issues

---

## Phase 4: Production Deployment

⚠️ **IMPORTANT: Only proceed after thorough staging testing!**

### Step 1: Create Backups

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Create backup directory
mkdir -p /backups/$(date +%Y%m%d)

# Backup database
mysqldump -u your_db_user -p pathpro_production > /backups/$(date +%Y%m%d)/database_backup.sql

# Backup application files
cd /var/www
tar -czf /backups/$(date +%Y%m%d)/pathpro_backup.tar.gz pathpro/

# Verify backups exist
ls -lh /backups/$(date +%Y%m%d)/
```

You should see both files with sizes greater than 0.

### Step 2: Enable Maintenance Mode (Optional)

```bash
cd /var/www/pathpro
php artisan down --message="Updating application, back in 5 minutes"
```

This shows a maintenance page to users. **Skip this if you want zero downtime.**

### Step 3: Pull Changes

```bash
# Navigate to production directory
cd /var/www/pathpro

# Fetch latest from GitHub
git fetch origin

# View available branches
git branch -a

# Checkout UI updates branch
git checkout ui-updates-2025

# Pull latest changes
git pull origin ui-updates-2025

# Verify you're on correct branch and commit
git log -1
```

### Step 4: Install Dependencies (if needed)

```bash
# Update Composer dependencies (likely no changes for CSS/JS only updates)
composer install --optimize-autoloader --no-dev

# Update NPM dependencies
npm install

# This should be fast if no package changes
```

### Step 5: Rebuild Assets

```bash
# Build production assets
npm run production
```

Wait for webpack to finish compiling. You should see "Compiled successfully" message.

### Step 6: Clear Caches

```bash
# Clear all caches
php artisan optimize:clear

# Re-optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 7: Disable Maintenance Mode (if enabled)

```bash
php artisan up
```

### Step 8: Verify Production

1. **Visit your live site immediately**
2. **Test critical functionality:**
   - Can you log in?
   - Does the roadmap load?
   - Are buttons styled correctly?
   - Test one feature creation/edit
3. **Check browser console** for any errors
4. **Monitor for 10-15 minutes** - watch for error reports

---

## Phase 5: Post-Deployment

### Monitor Application

```bash
# Watch Laravel logs in real-time
tail -f /var/www/pathpro/storage/logs/laravel.log

# Press Ctrl+C to stop watching
```

### If Everything Works

1. Merge `ui-updates-2025` branch to `main` on GitHub
2. Document deployment in your records
3. Keep backups for at least 30 days

### If Issues Occur

**See rollback.sh or follow manual rollback steps in this guide below**

---

## Rollback Procedure (If Needed)

### Quick Rollback

```bash
cd /var/www/pathpro

# Checkout previous branch (usually 'main')
git checkout main

# Pull latest from main
git pull origin main

# Rebuild assets
npm run production

# Clear and re-cache
php artisan optimize:clear
php artisan optimize

# Test site
```

### Full Rollback (Restore Backup)

```bash
# Stop web server
systemctl stop nginx

# Remove current application
mv /var/www/pathpro /var/www/pathpro_broken

# Restore from backup
cd /var/www
tar -xzf /backups/YYYYMMDD/pathpro_backup.tar.gz

# Restore database
mysql -u your_db_user -p pathpro_production < /backups/YYYYMMDD/database_backup.sql

# Start web server
systemctl start nginx

# Test site
```

---

## Troubleshooting

### Assets Not Loading / 404 Errors

```bash
# Rebuild assets
npm run production

# Clear cache
php artisan optimize:clear
php artisan optimize

# Check file permissions
ls -la /var/www/pathpro/public
```

### White Screen / 500 Error

```bash
# Check Laravel logs
tail -50 /var/www/pathpro/storage/logs/laravel.log

# Check Nginx error logs
tail -50 /var/log/nginx/error.log

# Check PHP-FPM logs
tail -50 /var/log/php8.1-fpm.log
```

### Database Errors

```bash
# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

### Permission Errors

```bash
# Reset permissions
chown -R www-data:www-data /var/www/pathpro
chmod -R 775 /var/www/pathpro/storage
chmod -R 775 /var/www/pathpro/bootstrap/cache
```

---

## Support Resources

- **Laravel Docs:** https://laravel.com/docs/10.x/deployment
- **Digital Ocean Docs:** https://docs.digitalocean.com
- **Nginx Config:** https://nginx.org/en/docs/

---

## Summary of Changes Being Deployed

These are CSS/JS only changes - **no database modifications**:

1. ✅ Button styling updates (Add New buttons, Share icon)
2. ✅ Pagination visibility (hidden until 10+ entries)
3. ✅ Modal styling consistency (News and Release Notes)
4. ✅ Filter icon fixes (eyeball color)
5. ✅ Text formatting (ban member alert)
6. ✅ Breadcrumb URL fixes
7. ✅ Banned member re-admission bug fix

**No risk to existing data** - Only visual/UI improvements.
