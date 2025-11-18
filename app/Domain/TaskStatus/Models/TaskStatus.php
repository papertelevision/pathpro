<?php

namespace App\Domain\TaskStatus\Models;

use App\Domain\Task\Enums\TaskStatusEnum;
use App\Domain\Task\Models\Task;
use Database\Factories\TaskStatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class TaskStatus extends Model
{
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return TaskStatusFactory::new();
    }

    /**
     * Get all of the tasks for the task status.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function scopeWithNoStatusFirst(Builder $query): void
    {
        $query->orderByRaw("CASE WHEN title = ? THEN 0 ELSE 1 END, title", [TaskStatusEnum::UNSPECIFIED->label()]);
    }
}
