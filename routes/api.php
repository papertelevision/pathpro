<?php

use App\Domain\Project\Models\Project;
use App\Http\Controllers\AdoptedSubmissionController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AuthUserController;
use App\Http\Controllers\AuthUserStripeProductController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ConfirmedFeatureController;
use App\Http\Controllers\FeatureCommentController;
use App\Http\Controllers\FeatureTypeController;
use App\Http\Controllers\HeaderSettingsController;
use App\Http\Controllers\HeaderStylesController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\ProjectBannedMemberController;
use App\Http\Controllers\TeamMemberInvitationController;
use App\Http\Controllers\ProjectCommunityMemberController;
use App\Http\Controllers\ProjectCompletedTaskController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFeatureController;
use App\Http\Controllers\ProjectFeatureGroupController;
use App\Http\Controllers\ProjectNewsAuthorController;
use App\Http\Controllers\ProjectNewsController;
use App\Http\Controllers\ProjectReleaseNoteAuthorController;
use App\Http\Controllers\ProjectReleaseNoteController;
use App\Http\Controllers\ProjectSubmissionController;
use App\Http\Controllers\ProjectTaskGroupController;
use App\Http\Controllers\ProjectTeamMemberController;
use App\Http\Controllers\ReleaseSettingsController;
use App\Http\Controllers\ResetPasswordLinkController;
use App\Http\Controllers\StripeCustomerController;
use App\Http\Controllers\StripeSubscriptionController;
use App\Http\Controllers\SubmissionStatusController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SubtaskController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskGroupController;
use App\Http\Controllers\TaskGroupIconController;
use App\Http\Controllers\TaskGroupOrderController;
use App\Http\Controllers\TaskOrderController;
use App\Http\Controllers\TaskSubtaskOrderController;
use App\Http\Controllers\UpvoteController;
use App\Http\Controllers\UserAvatarController;
use App\Http\Controllers\UnassignedUserController;
use App\Http\Controllers\UserRankController;
use App\Http\Controllers\VisibilityController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Unauthenticated user routes
Route::group([], function () {
    /**
     * Project
     */
    Route::get('projects/{project:slug}', [ProjectController::class, 'show'])
        ->name('projects.show');

    /*
     * Project - Task Groups.
     */
    Route::get('projects/{project:slug}/task-groups', [ProjectTaskGroupController::class, 'index'])
        ->name('projects.taskGroups.index');

    /*
     * Tasks
     */
    Route::get('tasks/{task}', [TaskController::class, 'show'])
        ->name('tasks.show')
        ->can('view,task');
    Route::get('tasks/{task}/comments', [TaskCommentController::class, 'show'])
        ->name('tasks-comments.show');

    /*
     * Project - Feature Voting.
     */
    Route::get('projects/{project:slug}/feature-group', [ProjectFeatureGroupController::class, 'show'])
        ->name('projects.featureGroup.show');
    Route::get('projects/{project:slug}/features', [ProjectFeatureController::class, 'index'])
        ->name('projects.features.index');

    /*
     * Project - Release Notes
     */
    Route::get('projects/{project:slug}/release-notes', [ProjectReleaseNoteController::class, 'index'])
        ->name('release-notes.index');

    /*
     * Features
     */
    Route::get('features/{feature}', [ProjectFeatureController::class, 'show'])
        ->name('features.show')
        ->can('view,feature');
    Route::get('feature-types', [FeatureTypeController::class, 'index'])
        ->name('feature-types.index');
    Route::get('features/{feature}/comments', [FeatureCommentController::class, 'show'])
        ->name('features-comments.show');

    /*
    * Upvotes
    */
    Route::delete('upvotes/{upvote}', [UpvoteController::class, 'destroy'])
        ->name('upvotes.destroy');
    Route::post('{project:slug}/upvotes', [UpvoteController::class, 'store'])
        ->name('upvotes.store');

    /**
     * Visibilities
     */
    Route::get('visibilities', [VisibilityController::class, 'index'])
        ->name('visibilities.index');

    /**
     * Header Settings
     */
    Route::get('header/{project:slug}', [HeaderSettingsController::class, 'show'])
        ->name('header.show');

    /**
     * Header Styles
     */
    Route::get('header/{header}/styles', HeaderStylesController::class)
        ->name('header.styles');
});

Route::middleware('auth:sanctum')
    ->group(function () {
        /*
         * Project
         */
        Route::controller(ProjectController::class)->group(function () {
            Route::get('projects', 'index')
                ->name('projects.index');
            Route::delete('projects/{project}', 'destroy')
                ->name('projects.destroy')
                ->can('delete,project');
            Route::post('projects/{project:slug}', 'update')
                ->name('projects.update')
                ->can('update,project');
            Route::post('projects', 'store')
                ->name('projects.store')
                ->can('create', Project::class);
        });

        /*
         * Project - Completed Tasks.
         */
        Route::get('projects/{project:slug}/completed-tasks', [ProjectCompletedTaskController::class, 'show'])
            ->name('projects-completed-tasks.show');

        /*
         * Project - Submissions.
         */
        Route::controller(ProjectSubmissionController::class)->group(function () {
            Route::get('/submissions', 'index')
                ->name('projects.submissions.index');
            Route::get('/{project:slug}/submission/{submission}', 'show')
                ->name('projects.submission.show')
                ->can('view,submission');
            Route::post('/submission', 'store')
                ->name('submissions.store');
            Route::post('submissions/{submission}', 'update')
                ->name('submissions.update')
                ->can('update,submission');
            Route::delete('/submissions', 'bulkDestroy')
                ->name('submissions.bulkDestroy');
        });
        Route::post('{project:slug}/adopted-submission/{submission}', [AdoptedSubmissionController::class, 'store'])
            ->name('project.adopted-submission.store');
        Route::get('submission-statuses', [SubmissionStatusController::class, 'index'])
            ->name('submission-statuses.index');

        /*
         * Project - Community members.
         */
        Route::controller(ProjectCommunityMemberController::class)->group(function () {
            Route::get('/community-members', 'index')
                ->name('projects.community-members.index');
            Route::get('{project:slug}/community-member/{user}', 'show')
                ->name('project.community-member.show');
            Route::get('/community-member/{user}', 'show')
                ->name('projects.community-member.show');
            Route::post('{project:slug}/community-member/store', 'store')
                ->name('project.community-member.store');
            Route::post('{project:slug}/community-member/{user}', 'update')
                ->name('project.community-member.update');
            Route::delete('{project:slug}/community-member/{user}', 'destroy')
                ->name('project.community-member.destroy');
            Route::delete('{project:slug}/community-members', 'bulkDestroy')
                ->name('project.community-members.bulk-destroy');
        });

        /*
         * Project - Team members.
         */
        Route::controller(ProjectTeamMemberController::class)->group(function () {
            Route::get('/team-members', 'index')
                ->name('projects.team-members.index');
            Route::get('{project:slug}/team-member/{user}', 'show')
                ->name('project.team-member.show');
            Route::get('/team-member/{user}', 'show')
                ->name('projects.team-member.show');
            Route::post('/team-member/{user}', 'update')
                ->name('projects.team-member.update');
            Route::delete('{project:slug}/team-member/{user}', 'destroy')
                ->name('project.team-member.destroy');
            Route::delete('{project:slug}/team-members', 'bulkDestroy')
                ->name('project.team-members.bulkDestroy');
        });

        /*
         * Project - Banned members.
         */
        Route::controller(ProjectBannedMemberController::class)->group(function () {
            Route::get('/banned-members', 'index')
                ->name('projects.banned-members.index');
            Route::get('{project:slug}/banned-member/{user}', 'show')
                ->name('project.banned-member.show');
            Route::get('/banned-member/{user}', 'show')
                ->name('projects.banned-member.show');
            Route::post('{project:slug}/banned-member/{user}', 'update')
                ->name('project.banned-member.update');
            Route::post('/banned-member/{user}', 'update')
                ->name('projects.banned-member.update');
            Route::post('{project:slug}/banned-members', 'bulkUpdate')
                ->name('project.banned-members.bulk-update');
            Route::post('/banned-members', 'bulkUpdate')
                ->name('projects.banned-members.bulk-update');
        });

        /*
        * Task Groups
        */
        Route::post('task-groups/{taskGroup}/icon', [TaskGroupIconController::class, 'update'])
            ->name('task-groups.icon.update')
            ->can('update,taskGroup');

        Route::post('{project:slug}/task-groups/icon', [TaskGroupIconController::class, 'store'])
            ->name('task-groups.icon.store');

        Route::delete('task-groups/{taskGroup}', [TaskGroupController::class, 'destroy'])
            ->name('task-groups.destroy')
            ->can('delete,taskGroup');

        Route::post('{project:slug}/task-groups-order', [TaskGroupOrderController::class, 'updateBulk'])
            ->name('task-groups-order.updateBulk');

        Route::post('task-groups/{taskGroup}', [TaskGroupController::class, 'update'])
            ->name('task-groups.update')
            ->can('update,taskGroup');

        Route::post('{project:slug}/task-groups', [TaskGroupController::class, 'store'])
            ->name('task-groups.store');

        /*
        * Tasks
        */
        Route::controller(TaskController::class)->group(function () {
            Route::post('tasks/{task}', 'update')
                ->name('tasks.update')
                ->can('update,task');
            Route::post('{project:slug}/tasks', 'store')
                ->name('tasks.store');
            Route::delete('tasks/{task}', 'destroy')
                ->name('tasks.destroy')
                ->can('delete,task');
        });

        Route::get('tasks-subtasks/{subtask}', [SubtaskController::class, 'show'])
            ->name('tasks-subtasks.show')
            ->can('view,feature');

        Route::post('{project:slug}/tasks-order', [TaskOrderController::class, 'updateBulk'])
            ->name('task-order.update');

        Route::post('tasks-subtasks-order', [TaskSubtaskOrderController::class, 'updateBulk'])
            ->name('task-order.updateBulk');

        /*
        * Subtasks
        */
        Route::post('{project:slug}/subtasks', [SubtaskController::class, 'store'])
            ->name('subtasks.store');

        Route::post('subtasks/{task}', [SubtaskController::class, 'update'])
            ->name('subtasks.update')
            ->can('update,task');

        Route::delete('subtasks/{task}', [SubtaskController::class, 'destroy'])
            ->name('subtasks.destroy')
            ->can('delete,task');

        /*
        * Users
        */
        Route::post('users/{user}/avatar', [UserAvatarController::class, 'update'])
            ->name('users.avatar.update');

        Route::get('unassigned-users', [UnassignedUserController::class, 'index'])
            ->name('users.index');

        /*
        * Authenticated User
        */
        Route::controller(AuthUserController::class)->group(function () {
            Route::get('authenticated-user', 'show')
                ->name('authenticated-user.show');
            Route::post('authenticated-user', 'update')
                ->name('authenticated-user.update');
            Route::post('authenticated-user/finish-onboarding', 'finishOnboarding')
                ->name('authenticated-user.finish-onboarding');
        });

        /*
        * Users - Ranks
        */
        Route::get('ranks', [UserRankController::class, 'index'])->name('ranks.index');

        /*
        * Features
        */
        Route::controller(ProjectFeatureController::class)->group(function () {
            Route::delete('features/{feature}', 'destroy')
                ->name('features.destroy')
                ->can('delete,feature');
            Route::post('features/{feature}', 'update')
                ->name('features.update')
                ->can('update,feature');
            Route::post('{project:slug}/features', 'store')
                ->name('features.store');
        });
        Route::post('confirmed-feature/{feature}', [ConfirmedFeatureController::class, 'store'])
            ->name('confirmed-feature.store')
            ->can('confirm,feature');

        /*
        * Feature Groups
        */
        Route::post('feature-groups/{featureGroup}', [ProjectFeatureGroupController::class, 'update'])
            ->name('featureGroups.update')
            ->can('update,featureGroup');

        /*
        * Comments
        */
        Route::controller(CommentController::class)->group(function () {
            Route::post('comments/{comment}', 'update')
                ->name('comments.update');
            Route::post('{project:slug}/comments', 'store')
                ->name('comments.store');
            Route::delete('comments/{comment}', 'destroy')
                ->name('comments.destroy')
                ->can('delete,comment');
        });

        /*
        * Attachments
        */
        Route::delete('attachments/{media}', [AttachmentController::class, 'destroy'])
            ->name('attachments.destroy');

        /*
        * Project - Release Notes
        */
        Route::controller(ProjectReleaseNoteController::class)->group(function () {
            Route::post('release-notes/{releaseNote}', 'update')
                ->name('release-notes.update')
                ->can('update,releaseNote');
            Route::post('{project:slug}/release-notes', 'store')
                ->name('release-notes.store');
            Route::get('release-notes/{releaseNote}', 'show')
                ->name('release-notes.show')
                ->can('view,releaseNote');
            Route::delete('{project:slug}/release-notes', 'bulkDestroy')
                ->name('release-notes.bulkDestroy')
                ->can('delete, releaseNote');
        });
        Route::get('projects/{project}/release-notes/authors', ProjectReleaseNoteAuthorController::class)
            ->name('projects-release-notes-authors.show');

        /*
         * Project - News.
         */
        Route::controller(ProjectNewsController::class)->group(function () {
            Route::get('{project:slug}/news', 'index')
                ->name('news.index');
            Route::get('news/{news}', 'show')
                ->name('news.show')
                ->can('view,news');
            Route::post('news/{news}', 'update')
                ->name('news.update')
                ->can('update,news');
            Route::post('{project:slug}/news', 'store')
                ->name('news.store');
            Route::delete('{project:slug}/news', 'bulkDestroy')
                ->name('news.bulkDestroy')
                ->can('delete, news');
        });
        Route::get('projects/{project}/news/authors', ProjectNewsAuthorController::class)
            ->name('projects-news-authors.show');

        /*
        * Subscriptions
        */
        Route::delete('subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])
            ->name('subscriptions.destroy');

        Route::post('subscriptions', [SubscriptionController::class, 'store'])
            ->name('subscriptions.store');

        /*
        * Password reset link
        */
        Route::post('reset-password', [ResetPasswordLinkController::class, 'store'])
            ->name('reset-password.store');

        /*
        * Invite Team Member
        */
        Route::controller(TeamMemberInvitationController::class)->group(function () {
            Route::get('team-members-invitations', 'index')
                ->name('team-member-invitation.index');
            Route::post('invite-team-member', 'store')
                ->name('team-member-invitation.store');
            Route::post('reinvite-team-member/{teamMemberInvitation}', 'update')
                ->name('team-member-invitation.update');
            Route::post('bulk-reinvite-team-member/{user}', 'bulkUpdate')
                ->name('team-member-invitation.bulkUpdate');
        });

        /**
         * Stripe
         */
        Route::controller(StripeSubscriptionController::class)->group(function () {
            Route::post('stripe-subscription/{plan}', 'update')
                ->name('stripe-subscription.update');
        });
        Route::controller(StripeCustomerController::class)->group(function () {
            Route::post('stripe-customer', 'update')
                ->name('stripe-subscription.update');
        });
        Route::controller(AuthUserStripeProductController::class)->group(function () {
            Route::get('auth-user/stripe-products', 'index')
                ->name('auth-user.stripe-products.index');
        });

        /**
         * Navigation
         */
        Route::get('/navigation', [NavigationController::class, 'show'])
            ->name('navigation.show');

        /**
         * Release Settings
         */
        Route::get('/release-settings', [ReleaseSettingsController::class, 'show'])
            ->name('release-settings.show');

        /**
         * Header Settings
         */
        Route::post('header/{header}', [HeaderSettingsController::class, 'update'])
            ->name('header.update')
            ->can('update,header');
    });
