# SCSS Backup - Original PathPro Styles

**Backup Date:** November 11, 2025
**Purpose:** Backup before glass design modernization

## Contents

This directory contains a complete backup of all SCSS files before applying the modern glass aesthetic redesign.

### Directory Structure:
- `/components/` - 58 component SCSS files
- `/generic/` - 7 foundation files (variables, mixins, fonts, base, etc.)
- `style.scss` - Main entry point

### Original Compiled CSS Size:
- **193 KiB** (public/css/style.css)

## Restoration Instructions

If you want to rollback to the original design:

1. **Delete the current SCSS directory:**
   ```bash
   rm -rf /Users/joshsears/Local_Software/PathPro/resources/scss/
   ```

2. **Restore from backup:**
   ```bash
   cp -r /Users/joshsears/Local_Software/PathPro/resources/scss-backup /Users/joshsears/Local_Software/PathPro/resources/scss
   ```

3. **Remove the README from the active directory:**
   ```bash
   rm /Users/joshsears/Local_Software/PathPro/resources/scss/README.md
   ```

4. **Recompile the CSS:**
   ```bash
   cd /Users/joshsears/Local_Software/PathPro
   npm run dev
   ```

5. **Clear browser cache and refresh**

## Design Characteristics (Original)

- Solid color backgrounds
- Simple box shadows
- Basic borders
- Standard hover effects
- No blur or glass effects
- Poppins font family
- Blue color scheme (#0e97e2)

## Files Backed Up

- All 58 component files
- All 7 generic foundation files
- Main style.scss entry point

This backup is safe to delete once you're confident in the new design.
