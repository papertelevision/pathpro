<?php

namespace App\Domain\Project\Models;

use App\Domain\Feature\Models\Feature;
use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\Header\Models\Header;
use App\Domain\News\Enums\NewsStatusEnum;
use App\Domain\News\Models\News;
use App\Domain\Project\Enums\ProjectDateFormatEnum;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Enums\ProjectVisibilityEnum;
use App\Domain\Project\QueryBuilders\ProjectQueryBuilder;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Submission\Models\Submission;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;
use Carbon\Carbon;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Project extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'visibility' => ProjectVisibilityEnum::class,
        'date_format' => ProjectDateFormatEnum::class,
        'is_dns_configured' => 'boolean',
        'is_description_public' => 'boolean',
        'is_public_upvoting_allowed' => 'boolean',
        'is_custom_domain_configured' => 'boolean',
        'are_feature_submissions_allowed' => 'boolean',
        'are_non_subscribers_allowed_to_subscribe_to_updates' => 'boolean',
        'are_non_subscribers_allowed_to_share_on_social_media' => 'boolean',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::created(function (Project $project) {
            $query = $project->header();
            if (! $query->exists()) {
                $query->create();
            }
        });

        static::deleted(function (Project $project) {
            $project->submissions()->delete();
        });
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return ProjectFactory::new();
    }

    /**
     * Create a new Eloquent query builder for the model.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return \App\Domain\Project\QueryBuilders\ProjectQueryBuilder
     */
    public function newEloquentBuilder($query): ProjectQueryBuilder
    {
        return new ProjectQueryBuilder($query);
    }

    /**
     * The creator that belong to the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Get all of the task groups for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function taskGroups()
    {
        return $this->hasMany(TaskGroup::class)->orderBy('order');
    }

    /**
     * Get all of the tasks for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get all of the news for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function news()
    {
        return $this->hasMany(News::class)->orderByDesc('updated_at');
    }

    /**
     * Get the latest news update of the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function latestLiveNews()
    {
        return $this->hasOne(News::class)->withStatus(NewsStatusEnum::LIVE())->orderByDesc('updated_at');
    }

    /**
     * Get all of the admin members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function adminMembers()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->where('project_user.role', ProjectUserRoleEnum::admin)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    /**
     * Get all of the team members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function teamMembers()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->where('project_user.role', ProjectUserRoleEnum::teamMember)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    /**
     * Get all of the community members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\hasManyThrough
     */
    public function communityMembers()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->where('project_user.role',  ProjectUserRoleEnum::communityMember)
            ->where(
                fn($query) => $query->where('project_user.rank', '!=', UserRankEnum::BANNED)
                    ->orWhereNull('project_user.rank')
            );
    }

    /**
     * Get all of the community members for the project who joined today.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\hasManyThrough
     */
    public function newCommunityMembers()
    {
        return $this->communityMembers()->whereDate('created_at', Carbon::today());
    }

    /**
     * Get all of the banned members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\hasManyThrough
     */
    public function bannedMembers()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->where('project_user.rank',  UserRankEnum::BANNED);
    }

    /**
     * Get all of the banned community members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\hasManyThrough
     */
    public function bannedCommunityMembers()
    {
        return $this->bannedMembers()
            ->where('project_user.role',  ProjectUserRoleEnum::communityMember);
    }

    /**
     * Get all of the banned team members for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\hasManyThrough
     */
    public function bannedTeamMembers()
    {
        return $this->bannedMembers()
            ->where('project_user.role',  ProjectUserRoleEnum::teamMember);
    }

    /**
     * Get the project feature group.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOne
     */
    public function featureGroup(): HasOne
    {
        return $this->hasOne(FeatureGroup::class);
    }

    /**
     * Get all of the features for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function features()
    {
        return $this->hasMany(Feature::class);
    }

    /**
     * Get the feature group.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOne
     */
    public function featureGroups()
    {
        return $this->hasOne(FeatureGroup::class);
    }

    /**
     * Get the header.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOne
     */
    public function header()
    {
        return $this->hasOne(Header::class);
    }

    /**
     * Get all of the release notes for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function releaseNotes()
    {
        return $this->hasMany(ReleaseNote::class)->orderByDesc('created_at');
    }

    /**
     * Get all of the submissions for the project.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function submissions()
    {
        return $this->hasMany(Submission::class)->orderByDesc('created_at');
    }

    /**
     * Get all new submissions.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function newSubmissions()
    {
        return $this->submissions()->new();
    }

    /**
     * Get the public projects.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function scopePublic($query)
    {
        return $query->where('visibility', ProjectVisibilityEnum::PUBLIC);
    }

    /**
     * Check if the project is private.
     * Private projects are visible only to Admin and Team Members.
     *
     * @return bool
     */
    public function isPrivate(): bool
    {
        return $this->visibility === ProjectVisibilityEnum::PRIVATE;
    }

    /**
     * Check if the project is archived.
     * Archived projects are visible only to Admin.
     *
     * @return bool
     */
    public function isArchived(): bool
    {
        return $this->visibility === ProjectVisibilityEnum::ARCHIVED;
    }

    /**
     * Check if the custom domain is configured.
     *
     * @return bool
     */
    public function isCustomDomainConfigured(): bool
    {
        return $this->custom_domain
            && $this->is_dns_configured
            && $this->is_custom_domain_configured;
    }
}
