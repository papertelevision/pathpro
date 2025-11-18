<?php

namespace App\Domain\Comment\Models;

use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\Upvote\Models\Upvote;
use App\Domain\User\Models\User;
use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Comment extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return CommentFactory::new();
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
     * Get the author of the comment.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function author()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Get the comment of the reply
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOne
     */
    public function parent()
    {
        return $this->hasOne(Comment::class, 'id', 'parent_comment_id');
    }

    /**
     * Get all of the replies for the comment.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Comment::class, 'parent_comment_id', 'id');
    }

    /**
     * Get the parent commentable model (task or feature).
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphTo
     */
    public function commentable()
    {
        return $this->morphTo();
    }

    /**
     * Get all of the upvotes for the comment.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphMany
     */
    public function upvotes()
    {
        return $this->morphMany(Upvote::class, 'upvotable');
    }

    /**
     * Get the project to which the commentable record belongs.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasOneThrough
     */
    public function project()
    {
        return $this->hasOneThrough(
            Project::class,
            $this->commentable_type,
            'id',
            'id',
            'commentable_id',
            'project_id'
        );
    }

    /**
     * Get all highlighted comments.
     *
     * @return void
     */
    public function scopeHighlighted($query)
    {
        return $query->where('is_comment_highlighted', 1);
    }

    /**
     * Get all of the comments on tasks and features of the project/s.
     *
     * @return void
     */
    public function scopeOfTypeTaskAndFeatureByProjects(
        $query,
        ?Project $project = null,
        ?Collection $projects = null,
    ) {
        return $query->whereHasMorph('commentable', [Task::class, Feature::class], function ($query) use ($project, $projects) {
            $query->whereHas('project', function ($query) use ($project, $projects) {
                isset($project)
                    ? $query->where('id', $project->id)
                    : $query->whereIn('project_id', $projects->pluck('id')->toArray());
            });
        });
    }
}
