<?php

namespace App\Domain\Task\Models;

use App\Domain\Comment\Models\Comment;
use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Subscription\Models\Subscription;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\TaskStatus\Models\TaskStatus;
use App\Domain\TaskType\Models\TaskType;
use App\Domain\Upvote\Models\Upvote;
use App\Domain\User\Models\User;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Task extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    const TASK_STATUS_COMPLETED = 'Complete';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['task_status_id'];

    protected $casts = [
        'visibility' => TaskGroupVisibilityEnum::class,
        'are_subtasks_allowed' => 'boolean',
        'are_comments_enabled' => 'boolean',
        'is_comment_upvoting_allowed' => 'boolean',
        'is_task_upvoting_enabled' => 'boolean',
        'are_team_members_visible' => 'boolean',
        'is_creator_visible' => 'boolean',
        'are_stats_public' => 'boolean',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleted(function (Task $task) {
            $task->children()->delete();
        });
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return TaskFactory::new();
    }

    /**
     * Register the media collections.
     *
     * @return void
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/gif',
                'image/webp',
                'image/svg+xml',
            ]);
    }

    /**
     * The task group that belong to the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function taskGroup()
    {
        return $this->belongsTo(TaskGroup::class);
    }

    /**
     * The project that the task belongs.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * The user who created the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * The task type that belong to the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function taskType()
    {
        return $this->belongsTo(TaskType::class);
    }

    /**
     * The task status that belong to the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function taskStatus()
    {
        return $this->belongsTo(TaskStatus::class);
    }

    /**
     * Get the task that the subtask belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOne
     */
    public function parent()
    {
        return $this->hasOne(Task::class, 'id', 'parent_task_id');
    }

    /**
     * Get all of the subtasks for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Task::class, 'parent_task_id', 'id')->orderBy('order');
    }


    /**
     * Get all of the upvotes for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function upvotes()
    {
        return $this->morphMany(Upvote::class, 'upvotable');
    }

    /**
     * Get all of the team members for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function teamMembers()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }

    /**
     * Get all of the community members for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsToMany
     */
    public function communityMembers()
    {
        return $this->belongsToMany(User::class, 'task_community_members', 'task_id', 'user_id');
    }

    /**
     * Get all of the comments for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable')->whereNull('parent_comment_id');
    }

    /**
     * Get all of the subscribers for the task.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function subscribers()
    {
        return $this->morphMany(Subscription::class, 'subscribable');
    }

    /**
     * Get all highlighted comments for the task.
     *
     * @return void
     */
    public function highlightedComments()
    {
        return $this->comments()->highlighted();
    }

    /**
     * The release note that the complete task belongs.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function releaseNote()
    {
        return $this->belongsTo(ReleaseNote::class);
    }

    /**
     * Get all of the completed tasks.
     *
     * @param  mixed $query
     * @return void
     */
    public function scopeCompleted($query)
    {
        return $query->whereHas('taskStatus', function (Builder $query) {
            $query->where('title', 'Complete');
        })->whereDoesntHave('releaseNote')->get();
    }


    /**
     * Get the published tasks.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function scopePublished($query)
    {
        return $query->where('visibility', TaskGroupVisibilityEnum::PUBLISHED);
    }
}
