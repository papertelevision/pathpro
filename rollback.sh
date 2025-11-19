#!/bin/bash

##############################################################################
# PathPro Quick Rollback Script
#
# This script quickly reverts to the previous working version
# Run this ON YOUR DIGITAL OCEAN DROPLET if deployment causes issues
#
# Usage: bash rollback.sh
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
APP_DIR="/var/www/pathpro"
PREVIOUS_BRANCH="main"  # The branch you were on before deploying

echo -e "${RED}========================================${NC}"
echo -e "${RED}PathPro Rollback${NC}"
echo -e "${RED}========================================${NC}"
echo ""

# Confirmation prompt
echo -e "${YELLOW}This will rollback your application to the previous version${NC}"
echo -e "${YELLOW}Previous branch: ${PREVIOUS_BRANCH}${NC}"
echo -e "${YELLOW}App Directory: ${APP_DIR}${NC}"
echo ""
read -p "Are you sure you want to rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${GREEN}Rollback cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Step 1: Switching to previous branch...${NC}"
cd "$APP_DIR"

# Discard any local changes
git reset --hard

# Checkout previous branch
git checkout "$PREVIOUS_BRANCH"
git pull origin "$PREVIOUS_BRANCH"

CURRENT_COMMIT=$(git log -1 --format="%h - %s")
echo -e "${GREEN}✓ Rolled back to commit: $CURRENT_COMMIT${NC}"

echo ""
echo -e "${YELLOW}Step 2: Rebuilding assets...${NC}"
npm run production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Assets rebuilt successfully${NC}"
else
    echo -e "${RED}✗ Asset rebuild failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Clearing caches...${NC}"
php artisan optimize:clear
php artisan optimize
echo -e "${GREEN}✓ Caches cleared and optimized${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Rollback Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Your application has been rolled back to: ${PREVIOUS_BRANCH}${NC}"
echo ""
echo "Please test your site immediately:"
echo "1. Visit your production URL"
echo "2. Test login and key features"
echo "3. Check browser console for errors"
echo ""
echo -e "${YELLOW}If issues persist, you may need to restore from backup.${NC}"
echo "See deployment-guide.md for full restore instructions."
echo ""
