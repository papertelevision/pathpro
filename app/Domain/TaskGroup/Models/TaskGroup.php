<?php

namespace App\Domain\TaskGroup\Models;

use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Enums\TaskGroupPlannedReleaseTypeEnum;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use Database\Factories\TaskGroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TaskGroup extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'task_groups';

    protected $fillable = ['icon', 'icon_type', 'icon_identifier'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'visibility' => TaskGroupVisibilityEnum::class,
        'planned_release_type' => TaskGroupPlannedReleaseTypeEnum::class,
        'is_percentage_complete_visible' => 'boolean',
        'is_planned_release_date_include' => 'boolean',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleted(function (TaskGroup $taskGroup) {
            $taskGroup->tasks()->delete();
            $taskGroup->subtasks()->delete();
        });
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return TaskGroupFactory::new();
    }

    /**
     * The project that the task group belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }

    /**
     * Get all of the tasks for the task group.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class)->whereNull('parent_task_id')->orderBy('order');
    }

    /**
     * Get all of the subtasks for the task group.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function subtasks()
    {
        return $this->hasMany(Task::class)->whereNotNull('parent_task_id')->orderBy('order');
    }

    /**
     * Get the completed percentage of the group.
     *
     */
    public function percentageComplete()
    {
        $totalTasks = $this->tasks()->count();
        $completedTasks = $this->tasks()->whereHas('taskStatus', function ($query) {
            $query->where('title', 'Complete');
        })->count();

        return $completedTasks === 0
            ? 0
            : (int) round(($completedTasks / $totalTasks) * 100);
    }

    /**
     * Get the published groups.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function scopePublished($query)
    {
        return $query->where('visibility', TaskGroupVisibilityEnum::PUBLISHED);
    }
}
