<?php

namespace App\Domain\User\Models;

use App\Domain\Comment\Models\Comment;
use App\Domain\News\Models\News;
use App\Domain\Plan\Models\PlanUser;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Project\Models\ProjectUser;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\Submission\Models\Submission;
use App\Domain\Subscription\Models\Subscription;
use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\Upvote\Models\Upvote;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Enums\UserRoleEnum;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Cashier\Billable;

class User extends Authenticatable implements HasMedia, FilamentUser
{
    use HasFactory, Notifiable, InteractsWithMedia, SoftDeletes, Billable;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'role' => UserRoleEnum::class,
        'email_verified_at' => 'datetime',
        'has_finished_onboarding' => 'boolean'
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return UserFactory::new();
    }

    /**
     * Get all of the projects for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function projects()
    {
        return $this->hasMany(Project::class, 'creator_id');
    }

    /**
     * Get all of the comments for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    /**
     * Get all of the upvotes for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function upvotes()
    {
        return $this->hasMany(Upvote::class, 'author_id');
    }

    /**
     * Get all of the upvoted tasks by user.
     *
     * @return void
     */
    public function upvotedTasks()
    {
        return $this->upvotes()->ofTypeTask();
    }

    /**
     * Get all of the upvoted comments by user.
     *
     * @return void
     */
    public function upvotedComments()
    {
        return $this->upvotes()->ofTypeComment();
    }

    /**
     * Get all of the upvoted features by user.
     *
     * @return void
     */
    public function upvotedFeatures()
    {
        return $this->upvotes()->ofTypeFeature();
    }

    /**
     * Get all of the upvoted tasks and features by user.
     *
     * @return void
     */
    public function upvotedTasksAndFeatures()
    {
        return $this->upvotes()->ofTypeTaskAndFeature();
    }

    /**
     * Get all of the release notes for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function releaseNotes()
    {
        return $this->hasMany(ReleaseNote::class, 'author_id');
    }

    /**
     * Get all of the news for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function news()
    {
        return $this->hasMany(News::class, 'author_id');
    }

    /**
     * Get all of the submissions for the user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'author_id')->withTrashed();
    }

    /**
     * Get all of the adopted submissions for the user.
     *
     * @return void
     */
    public function adoptedSubmissions()
    {
        return $this->submissions()->adopted();
    }

    /**
     * Get all of the user tasks and features subscriptions.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function taskAndFeatureSubscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the Stripe subscriptions of the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(StripeSubscription::class);
    }

    /**
     * Get the latest Stripe subscription of the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function lastSubscription(): HasOne
    {
        return $this->hasOne(StripeSubscription::class)->latest();
    }

    /**
     * Get the role and permissions that belongs to the logged user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function permissions()
    {
        return $this->belongsToMany(Project::class)
            ->using(ProjectUser::class)
            ->withPivot(['role', 'rank', 'is_rank_visible', 'permission', 'project_id', 'is_joined']);
    }

    /**
     * Get the user invitations.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(TeamMemberInvitation::class);
    }

    /**
     * Get the user plan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function plan(): HasOne
    {
        return $this->hasOne(PlanUser::class);
    }

    /**
     * Determines whether the User is super admin.
     *
     * @return bool
     */
    public function isSuperAdmin()
    {
        return $this->role === UserRoleEnum::SUPER_ADMIN;
    }

    /**
     * Determines whether the User has plan.
     *
     * @return bool
     */
    public function hasPlan()
    {
        if ($this->isSuperAdmin()) return true;

        return $this->plan()->exists();
    }

    /**
     * Determines whether the User can access the Filament panel.
     *
     * @return bool
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isSuperAdmin();
    }

    /**
     * Determines whether the User can create projects.
     *
     * @return bool
     */
    public function canCreateProjects(): bool
    {
        if ($this->isSuperAdmin()) return true;

        $plan = $this->plan;
        if ($plan) {
            $currentProjectsCount = $this->projects()->count();
            $plan = $plan->plan;

            if (is_null($plan->projects_count)) {
                return true;
            }

            if ($currentProjectsCount < $plan->projects_count) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines whether the User can assign team members to his projects.
     *
     * @return bool
     */
    public function canAssignTeamMembers()
    {
        if ($this->isSuperAdmin()) return true;

        $plan = $this->plan;
        if ($plan) {
            $plan = $plan->plan;

            if (is_null($plan->team_members_count)) {
                return true;
            }

            if ($plan->isFree()) {
                return false;
            }

            if ($this->getTeamMembersCount() < $plan->team_members_count) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines whether the User can have more community members joining his projects.
     *
     * @return bool
     */
    public function canHaveCommunityMembers()
    {
        if ($this->isSuperAdmin()) return true;

        $plan = $this->plan;
        if ($plan) {
            $plan = $plan->plan;

            if (is_null($plan->community_members_count)) {
                return true;
            }

            if ($this->getCommunityMembersCount() < $plan->community_members_count) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the count of the assigned team members to the projects created by the user.
     *
     * @return int
     */
    public function getTeamMembersCount()
    {
        return ProjectUser::whereIn('project_id', $this->projects->pluck('id')->toArray())
            ->where('role', ProjectUserRoleEnum::teamMember)
            ->distinct('user_id')
            ->count();
    }

    /**
     * Get the count of the assigned community members to the projects created by the user.
     *
     * @return int
     */
    public function getCommunityMembersCount()
    {
        return ProjectUser::whereIn('project_id', $this->projects->pluck('id')->toArray())
            ->where('role', ProjectUserRoleEnum::communityMember)
            ->distinct('user_id')
            ->count();
    }

    public function assignedToProjects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, ProjectUser::class, 'user_id', 'project_id');
    }

    public function assignedAsCommunityMemberToProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where('project_user.role', ProjectUserRoleEnum::communityMember)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    public function assignedAsTeamMemberToProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where('project_user.role', ProjectUserRoleEnum::teamMember)
            ->where('is_joined', true)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    public function assignedAsJoinedOrUnjoinedTeamMemberToProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where('project_user.role', ProjectUserRoleEnum::teamMember)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    public function assignedAsAdminToProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where('project_user.role', ProjectUserRoleEnum::admin)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    public function assignedAsAdminOrTeamMemberToProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where(function ($query) {
                $query->where('project_user.role', ProjectUserRoleEnum::admin)
                    ->orWhere('project_user.role', ProjectUserRoleEnum::teamMember)
                    ->where(function ($query) {
                        $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                            ->orWhereNull('project_user.rank');
                    })
                    ->where('is_joined', true);
            });
    }

    public function bannedFromProjects(): HasManyThrough
    {
        return $this->hasManyThrough(Project::class, ProjectUser::class, 'user_id', 'id', 'id', 'project_id')
            ->where('project_user.rank', UserRankEnum::BANNED);
    }
}
