<?php

use App\Domain\Project\Middleware\EnsureProjectIsAccessible;
use App\Domain\TeamMemberInvitation\Middleware\EnsureTeamMemberInvitationTokenIsValid;
use App\Http\Controllers\AppSumoController;
use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\FallbackController;
use App\Http\Controllers\PagesSettingsController;
use App\Http\Controllers\ProjectCommunityMemberAuthController;
use App\Http\Controllers\ProjectSubmissionController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\ResetPasswordLinkController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\StripeProductController;
use App\Http\Controllers\StripeSubscriptionController;
use App\Http\Controllers\TeamMemberInvitationController;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Route;

/**
 * Subdomain routes
 */
Route::domain("{project:slug}." . config('app.domain'))
    ->middleware([EnsureProjectIsAccessible::class])
    ->group(function () {
        /**
         * Project
         */
        Route::view('/', 'index')->name('project.show');
        Route::view('/projects', 'index')->name('projects')->middleware('auth:sanctum');
        Route::view('/task/{task}/comment/{comment}', 'index')->name('comment-view');

        /**
         * Community Member
         */
        Route::get('/community-member/register', [ProjectCommunityMemberAuthController::class, 'index'])
            ->name('community-member.register.index')
            ->middleware('guest:sanctum');
        Route::post('/register/store', [ProjectCommunityMemberAuthController::class, 'register'])
            ->name('community-member.register.store')
            ->middleware('guest:sanctum');
        Route::view('/community-members/{user}', 'index')
            ->name('community-member.show')
            ->can('viewCommunityAndTeamMembers')
            ->middleware('auth:sanctum');

        /**
         * Team Member
         */
        Route::view('/team-members/{user}', 'index')
            ->name('team-member.show')
            ->can('viewCommunityAndTeamMembers')
            ->middleware('auth:sanctum');

        /**
         * Submission
         */
        Route::get('/submissions/{submission}', [ProjectSubmissionController::class, 'edit'])
            ->name('submission.show')
            ->middleware('auth:sanctum');

        /**
         * Release Notes.
         */
        Route::view('/release-notes', 'index')->name('web.release-notes.index');

        /**
         * Project Inner Pages
         */
        Route::any('/{any}', FallbackController::class);
    });

/**
 * Project Listing.
 */
Route::redirect('/', RouteServiceProvider::HOME);
Route::view('/projects', 'index')->name('projects')->middleware('auth:sanctum');

/**
 * Team Member Invitation
 */
Route::get('/team-member-invitation/register', [TeamMemberInvitationController::class, 'show'])
    ->middleware([EnsureTeamMemberInvitationTokenIsValid::class])
    ->middleware('guest:sanctum')
    ->name('team-member-invitation.register');
Route::get('/team-member-invitation/login', [TeamMemberInvitationController::class, 'show'])
    ->middleware([EnsureTeamMemberInvitationTokenIsValid::class])
    ->name('team-member-invitation.login');
Route::delete('/team-member-invitation/{teamMemberInvitation}', [TeamMemberInvitationController::class, 'destroy'])
    ->middleware([EnsureTeamMemberInvitationTokenIsValid::class])
    ->name('team-member-invitation.destroy');

/**
 * Fortify
 */
Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login')->middleware('guest:sanctum');
Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store')->middleware('guest:sanctum');
Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);
Route::view('create-new-password/{email}', 'index')->name('create-new-password')->middleware('guest:sanctum');
Route::post('reset-password/{email}', [ResetPasswordLinkController::class, 'update'])->name('reset-password.update');

/**
 * AppSumo
 */
Route::get('register', [RegisterController::class, 'show'])->name('register.index');
Route::post('register', [RegisterController::class, 'store'])->name('register.store')->middleware('guest:sanctum');
Route::any('appsumo/webhook', AppSumoController::class)->name('appsumo-webhook')->middleware('guest:sanctum');

/**
 * Socialite
 */
Route::controller(SocialiteController::class)->group(function () {
    Route::get('/auth/{driver}', 'redirect')->name('auth-google.redirect');

    Route::get('/auth/google/callback', 'callback')->name('auth-google.callback');
    Route::get('/auth/facebook/callback', 'callback')->name('auth-facebook.callback');
})->middleware('guest:sanctum');

/**
 * Stripe
 */
Route::prefix('/stripe-purchase-product/{plan:slug}')
    ->group(function () {
        Route::get('/register', [StripeSubscriptionController::class, 'create'])
            ->name('stripe-product-register.create');
        Route::get('/billing',  fn() => view('index'))
            ->name('stripe-product.billing')
            ->middleware('auth:sanctum');

        Route::controller(StripeProductController::class)
            ->group(function () {
                Route::get('/show', 'show')
                    ->name('stripe-product.show');
                Route::post('/register', 'register')
                    ->name('stripe-product.register')
                    ->middleware('guest:sanctum');
                Route::post('/purchase', 'purchase')
                    ->name('stripe-product.purchase')
                    ->middleware('auth:sanctum');
            });
    });
Route::controller(StripeProductController::class)
    ->group(function () {
        Route::get('/stripe-products', 'index')
            ->name('stripe-product.index');
    });
Route::controller(PagesSettingsController::class)
    ->group(function () {
        Route::get('/pages-settings', 'show')
            ->name('pages-settings.show');
    });

/**
 * Fallback
 */
Route::fallback(FallbackController::class);
