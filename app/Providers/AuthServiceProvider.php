<?php

namespace App\Providers;

use App\Domain\Comment\Models\Comment;
use App\Domain\Comment\Policies\CommentPolicy;
use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\User\Models\User;
use App\Domain\Project\Policies\ProjectPolicy;
use App\Domain\Task\Policies\TaskPolicy;
use App\Domain\Feature\Policies\FeaturePolicy;
use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\FeatureGroup\Policies\FeatureGroupPolicy;
use App\Domain\Header\Models\Header;
use App\Domain\Header\Policies\HeaderPolicy;
use App\Domain\News\Models\News;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\ReleaseNote\Policies\ReleaseNotePolicy;
use App\Domain\Submission\Models\Submission;
use App\Domain\Submission\Policies\SubmissionPolicy;
use App\Domain\News\Policies\NewsPolicy;
use App\Domain\Plan\Models\Plan;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\Plan\Policies\PlanPolicy;
use App\Domain\Stripe\Policies\StripeSubscriptionPolicy;
use App\Domain\TaskGroup\Policies\TaskGroupPolicy;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\Upvote\Models\Upvote;
use App\Domain\Upvote\Policies\UpvotePolicy;
use App\Domain\User\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Task::class => TaskPolicy::class,
        News::class => NewsPolicy::class,
        Plan::class => PlanPolicy::class,
        Upvote::class => UpvotePolicy::class,
        Header::class => HeaderPolicy::class,
        Feature::class => FeaturePolicy::class,
        Project::class => ProjectPolicy::class,
        Comment::class => CommentPolicy::class,
        TaskGroup::class => TaskGroupPolicy::class,
        Submission::class => SubmissionPolicy::class,
        ReleaseNote::class => ReleaseNotePolicy::class,
        FeatureGroup::class => FeatureGroupPolicy::class,
        StripeSubscription::class => StripeSubscriptionPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        // Implicitly grant "Super Admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user->can() and @can()
        Gate::before(function ($user, $ability) {
            if ($user->isSuperAdmin()) {
                return true;
            }
        });
    }
}
