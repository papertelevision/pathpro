#!/bin/bash

##############################################################################
# PathPro Quick Production Deployment Script
#
# This script automates the deployment process for UI updates
# Run this ON YOUR DIGITAL OCEAN DROPLET after testing on staging
#
# Usage: bash quick-deploy.sh
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
APP_DIR="/var/www/pathpro"
BRANCH="ui-updates-2025"
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
DB_NAME="pathpro_production"
DB_USER="your_db_user"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PathPro Production Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Confirmation prompt
echo -e "${YELLOW}This will deploy UI updates to PRODUCTION${NC}"
echo -e "${YELLOW}Branch: ${BRANCH}${NC}"
echo -e "${YELLOW}App Directory: ${APP_DIR}${NC}"
echo ""
read -p "Have you tested on staging? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Deployment cancelled. Please test on staging first.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 1: Creating backups...${NC}"
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
read -sp "Enter database password: " DB_PASS
echo ""
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/database_backup.sql"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database backed up to $BACKUP_DIR/database_backup.sql${NC}"
else
    echo -e "${RED}✗ Database backup failed${NC}"
    exit 1
fi

# Backup application files
echo "Backing up application files..."
cd "$(dirname "$APP_DIR")"
tar -czf "$BACKUP_DIR/app_backup.tar.gz" "$(basename "$APP_DIR")"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application backed up to $BACKUP_DIR/app_backup.tar.gz${NC}"
else
    echo -e "${RED}✗ Application backup failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 2: Pulling latest code from GitHub...${NC}"
cd "$APP_DIR"

# Fetch and checkout branch
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

CURRENT_COMMIT=$(git log -1 --format="%h - %s")
echo -e "${GREEN}✓ Now on commit: $CURRENT_COMMIT${NC}"

echo ""
echo -e "${GREEN}Step 3: Installing dependencies...${NC}"

# Composer
composer install --optimize-autoloader --no-dev --no-interaction
echo -e "${GREEN}✓ Composer dependencies installed${NC}"

# NPM
npm install --silent
echo -e "${GREEN}✓ NPM dependencies installed${NC}"

echo ""
echo -e "${GREEN}Step 4: Building production assets...${NC}"
npm run production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Assets compiled successfully${NC}"
else
    echo -e "${RED}✗ Asset compilation failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 5: Optimizing application...${NC}"

# Clear caches
php artisan optimize:clear
echo -e "${GREEN}✓ Caches cleared${NC}"

# Re-cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✓ Application optimized${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit your production site and test immediately"
echo "2. Check browser console for errors"
echo "3. Test key functionality (login, roadmap, features)"
echo "4. Monitor logs: tail -f $APP_DIR/storage/logs/laravel.log"
echo ""
echo -e "${YELLOW}Backups saved to: $BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}If you encounter issues, run: bash rollback.sh${NC}"
echo ""
