# PathPro Deployment Files

This directory contains everything you need to safely deploy your UI updates to Digital Ocean.

## 📁 Files in This Package

### Documentation

- **deployment-guide.md** - Complete step-by-step deployment guide with all commands and explanations
- **staging-setup.md** - Detailed guide for setting up your staging environment
- **DEPLOYMENT-README.md** (this file) - Quick start guide

### Scripts

- **quick-deploy.sh** - Automated production deployment script (run on Digital Ocean droplet)
- **rollback.sh** - Quick rollback script if something goes wrong (run on Digital Ocean droplet)

---

## 🚀 Quick Start

### Step 1: Local Setup (Do this first)

1. **Create Branch in GitHub Desktop:**
   - Open GitHub Desktop
   - Create new branch named: `ui-updates-2025`
   - Ensure all changes are committed
   - Push branch to GitHub

### Step 2: Setup Staging Environment

📖 **Follow: staging-setup.md**

This will:
- Clone your repository to a staging directory
- Setup a staging database with copy of production data
- Configure staging subdomain (staging.yourdomain.com)
- Install SSL certificate
- Allow you to test safely

**Time required:** ~30-45 minutes (one-time setup)

### Step 3: Test on Staging

Visit `https://staging.yourdomain.com` and verify:

- [ ] All button styling updates work correctly
- [ ] Pagination hides/shows at correct thresholds
- [ ] Modal styling matches expected design
- [ ] Icons display correctly
- [ ] Public view buttons styled properly
- [ ] No browser console errors
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices

### Step 4: Deploy to Production

**Option A: Use Automated Script (Recommended)**

1. Transfer `quick-deploy.sh` to your Digital Ocean droplet
2. SSH into your droplet
3. Run: `bash quick-deploy.sh`
4. Follow prompts and verify deployment

**Option B: Manual Deployment**

📖 **Follow: deployment-guide.md** Phase 4

Both methods include automatic backups before deployment.

---

## 📋 What's Being Deployed

These updates are **CSS/JavaScript only** - no database changes:

✅ Button styling (Add New, Share, Project News, Submit Feedback)
✅ Pagination visibility (hidden until 10+ entries)
✅ Modal consistency (News and Release Notes)
✅ Icon fixes (eyeball color on roadmap)
✅ Text formatting (ban member alert)
✅ Breadcrumb URL fixes
✅ Bug fix (banned member re-admission)

**Zero risk to your production database or user data.**

---

## 🔄 Deployment Workflow Overview

```
┌─────────────────┐
│  Local Machine  │
│  (GitHub Desktop)│
│                 │
│  Create Branch  │
│  Commit Changes │
│  Push to GitHub │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌────────────────┐            ┌────────────────┐
│    Staging     │            │   Production   │
│   Environment  │            │   Environment  │
│                │            │                │
│ Git Pull       │            │ 1. Backup DB   │
│ Test Updates   │            │ 2. Backup Files│
│ Verify Works   │            │ 3. Git Pull    │
│                │            │ 4. Build Assets│
│ If OK ─────────┼───────────>│ 5. Deploy      │
│                │            │ 6. Verify      │
└────────────────┘            └────────────────┘
                                       │
                                       │ If Issues
                                       ▼
                              ┌────────────────┐
                              │   Rollback     │
                              │                │
                              │ Run rollback.sh│
                              │ OR             │
                              │ Restore Backup │
                              └────────────────┘
```

---

## 🛡️ Safety Features

### Automatic Backups

The deployment process creates backups before any changes:
- Database dump
- Full application files archive
- Stored in `/backups/` directory on your droplet

### Staging Environment

Test everything on staging before production:
- Separate database with production data copy
- Separate subdomain
- No risk to production users

### Easy Rollback

If anything goes wrong:
1. Run `bash rollback.sh` for quick git-based rollback
2. Or restore from automatic backups
3. Detailed instructions in deployment-guide.md

### Version Control

All changes tracked in Git:
- Easy to see exactly what changed
- Can rollback to any previous commit
- Clear history of deployments

---

## ⚡ Using the Deployment Scripts

### quick-deploy.sh

**Purpose:** Automates production deployment

**What it does:**
1. Creates automatic backups (database + files)
2. Pulls latest code from GitHub
3. Installs dependencies
4. Builds production assets
5. Clears and optimizes caches
6. Confirms successful deployment

**Usage:**
```bash
# Upload script to your droplet (use SFTP or paste contents)

# On your Digital Ocean droplet:
cd /var/www
chmod +x quick-deploy.sh

# Edit configuration at top of script:
nano quick-deploy.sh
# Update: APP_DIR, BRANCH, DB_NAME, DB_USER

# Run deployment:
bash quick-deploy.sh

# Follow prompts
```

### rollback.sh

**Purpose:** Quickly revert to previous version if issues occur

**What it does:**
1. Switches back to previous Git branch
2. Rebuilds assets for previous version
3. Clears caches
4. Returns site to working state

**Usage:**
```bash
# On your Digital Ocean droplet:
cd /var/www
chmod +x rollback.sh

# Edit configuration:
nano rollback.sh
# Update: APP_DIR, PREVIOUS_BRANCH

# Run rollback:
bash rollback.sh

# Confirm when prompted
```

---

## 📖 Detailed Documentation

### For Complete Instructions

**📄 deployment-guide.md** - Read this for:
- Full deployment process explanation
- All commands with detailed explanations
- Troubleshooting common issues
- Manual rollback procedures
- Post-deployment checklist

**📄 staging-setup.md** - Read this for:
- Setting up staging environment
- DNS configuration for staging subdomain
- Nginx configuration
- SSL certificate setup
- Testing procedures

---

## 🔍 Pre-Deployment Checklist

Before deploying to production:

- [ ] All changes committed and pushed to `ui-updates-2025` branch
- [ ] Staging environment set up and working
- [ ] All UI updates tested on staging
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices
- [ ] No console errors on staging
- [ ] Database backup completed
- [ ] Application files backup completed
- [ ] Reviewed deployment-guide.md
- [ ] Know how to access SSH if needed
- [ ] Know how to rollback if needed

---

## ⏱️ Timeline Expectations

### First Time (Setting Up Staging)
- **Staging Setup:** 30-45 minutes
- **Testing on Staging:** 30-60 minutes
- **Production Deployment:** 10-15 minutes
- **Total:** ~1.5-2 hours

### Future Deployments (Staging Already Setup)
- **Push to Staging:** 5 minutes
- **Test on Staging:** 15-30 minutes
- **Deploy to Production:** 10-15 minutes
- **Total:** ~30-50 minutes

---

## 🆘 Getting Help

### If Something Goes Wrong

1. **Don't panic** - You have backups
2. **Check the logs:**
   ```bash
   tail -f /var/www/pathpro/storage/logs/laravel.log
   ```
3. **Run rollback:**
   ```bash
   bash rollback.sh
   ```
4. **Consult deployment-guide.md** troubleshooting section

### Common Issues & Solutions

**White screen / 500 error:**
```bash
php artisan optimize:clear
php artisan optimize
```

**Assets not loading:**
```bash
npm run production
php artisan optimize:clear
```

**Permission errors:**
```bash
chown -R www-data:www-data /var/www/pathpro
chmod -R 775 storage bootstrap/cache
```

---

## 📞 Support Resources

- **Laravel Deployment Docs:** https://laravel.com/docs/10.x/deployment
- **Digital Ocean Tutorials:** https://www.digitalocean.com/community/tutorials
- **Nginx Documentation:** https://nginx.org/en/docs/

---

## ✅ Post-Deployment

After successful deployment:

1. **Monitor for 15-30 minutes**
   - Watch error logs
   - Check user reports
   - Test critical features

2. **Verify Everything Works**
   - Login functionality
   - Task creation/editing
   - Feature voting
   - File uploads
   - Payment processing (if applicable)

3. **Document Deployment**
   - Note date and time
   - Record any issues encountered
   - Keep backups for 30 days

4. **Merge to Main** (Optional)
   - Once confirmed stable
   - Merge `ui-updates-2025` to `main` branch on GitHub
   - This keeps your main branch up to date

---

## 🎯 Summary

You now have:
- ✅ Complete deployment documentation
- ✅ Automated deployment scripts
- ✅ Rollback procedures
- ✅ Staging environment setup guide
- ✅ Safety through backups and testing

**Start with staging-setup.md to create your safe testing environment!**

Good luck with your deployment! 🚀
