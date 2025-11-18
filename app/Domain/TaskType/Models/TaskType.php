<?php

namespace App\Domain\TaskType\Models;

use Database\Factories\TaskTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return TaskTypeFactory::new();
    }

    /**
     * Get all of the tasks for the task type.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get all of the subtasks for the task type.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function subtasks()
    {
        return $this->hasMany(Subtask::class);
    }
}
