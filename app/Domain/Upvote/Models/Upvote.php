<?php

namespace App\Domain\Upvote\Models;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\User\Models\User;
use Database\Factories\UpvoteFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Upvote extends Model
{
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return UpvoteFactory::new();
    }

    /**
     * Get the author of the upvote.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function author()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Get the parent upvotable model (task or comment).
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphTo
     */
    public function upvotable()
    {
        return $this->morphTo();
    }

    /**
     * Get all of the upvotes for tasks.
     *
     * @return void
     */
    public function scopeOfTypeTask($query)
    {
        return $query->where('upvotable_type', Task::class);
    }

    /**
     * Get all of the upvotes for comments.
     *
     * @return void
     */
    public function scopeOfTypeComment($query)
    {
        return $query->where('upvotable_type', Comment::class);
    }

    /**
     * Get all of the upvotes for features.
     *
     * @return void
     */
    public function scopeOfTypeFeature($query)
    {
        return $query->where('upvotable_type', Feature::class);
    }

    /**
     * Get all of the upvotes for tasks and features.
     *
     * @return void
     */
    public function scopeOfTypeTaskAndFeature($query)
    {
        return $query->where('upvotable_type', Feature::class)
            ->orWhere('upvotable_type', Task::class);
    }

    /**
     * Get all of the upvotes for tasks and features of the given project/s.
     *
     * @return void
     */
    public function scopeOfTypeTaskAndFeatureByProjects(
        $query,
        ?Project $project = null,
        ?Collection $projects = null,
    ) {
        return $query->whereHasMorph('upvotable', [Task::class, Feature::class], function ($query) use ($project, $projects) {
            $query->whereHas('project', function ($query) use ($project, $projects) {
                isset($project)
                    ? $query->where('id', $project->id)
                    : $query->whereIn('project_id', $projects->pluck('id')->toArray());
            });
        });
    }

    /**
     * Get all of the upvotes for comments of the given project/s.
     *
     * @return void
     */
    public function scopeOfTypeCommentByProjects(
        $query,
        ?Project $project = null,
        ?Collection $projects = null,
    ) {
        return $query->whereHasMorph('upvotable', [Comment::class], function ($query) use ($project, $projects) {
            $query->whereHasMorph('commentable', [Task::class, Feature::class], function ($query) use ($project, $projects) {
                $query->whereHas('project', function ($query) use ($project, $projects) {
                    isset($project)
                        ? $query->where('id', $project->id)
                        : $query->whereIn('project_id', $projects->pluck('id')->toArray());
                });
            });
        });
    }
}
