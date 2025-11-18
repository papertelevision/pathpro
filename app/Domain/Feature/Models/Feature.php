<?php

namespace App\Domain\Feature\Models;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\FeatureType\Models\FeatureType;
use App\Domain\Project\Models\Project;
use App\Domain\Subscription\Models\Subscription;
use App\Domain\Upvote\Models\Upvote;
use App\Domain\User\Models\User;
use Database\Factories\FeatureFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'visibility' => FeatureVisibilityEnum::class,
        'is_task_confirmed' => 'boolean',
        'are_stats_public' => 'boolean',
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return FeatureFactory::new();
    }

    /**
     * The feature group that belong to the feature.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function featureGroup()
    {
        return $this->belongsTo(FeatureGroup::class);
    }

    /**
     * The project that the feature task belongs.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * The type that belong to the feature task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function featureTaskType()
    {
        return $this->belongsTo(FeatureType::class, 'feature_type_id');
    }


    /**
     * Get all of the comments for the feature task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable')->whereNull('parent_comment_id');
    }

    /**
     * Get all of the subscribers for the feature.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function subscribers()
    {
        return $this->morphMany(Subscription::class, 'subscribable');
    }

    /**
     * Get all highlighted comments for the feature task.
     *
     * @return void
     */
    public function scopeHighlightedComments()
    {
        return $this->comments()->where('is_comment_highlighted', 1);
    }

    /**
     * Get all of the upvotes for the feature task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function upvotes()
    {
        return $this->morphMany(Upvote::class, 'upvotable');
    }

    /**
     * Get all of the community members for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function communityMembers()
    {
        return $this->belongsToMany(User::class, 'feature_user', 'feature_id', 'user_id');
    }

    /**
     * Get the public features.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function scopePublic($query)
    {
        return $query->where('visibility', FeatureVisibilityEnum::PUBLIC);
    }
}
