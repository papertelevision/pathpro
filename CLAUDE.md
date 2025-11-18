# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### PHP/Laravel Backend
- `php artisan serve` - Start development server
- `php artisan migrate` - Run database migrations
- `php artisan migrate:fresh --seed` - Fresh migrate with seeding
- `php artisan test` - Run PHPUnit tests
- `php artisan test --filter TestName` - Run specific test
- `composer install` - Install PHP dependencies
- `composer dump-autoload` - Regenerate autoloader

### Frontend (React/Node.js)
- `npm install` - Install Node dependencies
- `npm run dev` - Start development build with Laravel Mix
- `npm run watch` - Watch for changes and rebuild
- `npm run hot` - Hot reload development server
- `npm run production` - Build for production

## Architecture Overview

PathPro is a Laravel-based project management platform with React frontend using a Domain-Driven Design (DDD) approach.

### Backend Structure
- **Domain Layer** (`app/Domain/`): Core business logic organized by domain contexts:
  - `Project/` - Project management core
  - `Task/` - Task and subtask management
  - `TaskGroup/` - Task organization and grouping
  - `User/` - User management and roles
  - `Feature/` - Feature request system
  - `Submission/` - Community submissions
  - `Comment/` - Commenting system with upvotes
  - `News/` - Release notes and announcements
  - `Stripe/` - Payment processing integration

- **HTTP Layer** (`app/Http/`): Controllers, Resources, and Middleware
- **Actions** (`app/Domain/*/Actions/`): Single-purpose action classes for complex operations
- **Policies** (`app/Domain/*/Policies/`): Authorization logic per domain
- **Query Builders** (`app/Domain/*/QueryBuilders/`): Custom query builders for complex queries

### Frontend Structure
- **React SPA** with React Router for navigation
- **Domain-based organization** (`resources/js/domain/`) mirroring backend domains
- **Shared components** (`resources/js/components/`) for reusable UI elements
- **React Query** for API state management
- **Context providers** for global state (permissions, notifications, header)

### Multi-tenancy & Subdomain Routing
- Projects are accessed via subdomains: `{project-slug}.domain.com`
- Custom domain support with DNS validation
- Middleware `EnsureProjectIsAccessible` handles project-based access control
- Different user roles: Admin, Team Member, Community Member

### Key Relationships
- **Projects** contain TaskGroups, Features, News, Submissions
- **Tasks** belong to TaskGroups, can have subtasks (parent_task_id)
- **Users** have different roles per project via pivot table `project_user`
- **Comments** are polymorphic (tasks, features) with upvoting system
- **Upvotes** are polymorphic across multiple entities

### Authentication & Authorization
- Laravel Sanctum for API authentication
- Laravel Fortify for auth scaffolding with custom controllers
- Social login via Laravel Socialite (Google, Facebook)
- Role-based permissions per project (not global)

### Payment Integration
- Laravel Cashier for Stripe subscriptions
- AppSumo integration for lifetime deals
- Plan-based feature restrictions

### Asset Pipeline
- Laravel Mix for asset compilation
- SCSS with component-based organization
- React with Babel compilation
- Webpack aliases: `@` for resources, `@app` for js

### Testing
- PHPUnit for backend testing (Feature and Unit tests)
- Test database configuration in phpunit.xml