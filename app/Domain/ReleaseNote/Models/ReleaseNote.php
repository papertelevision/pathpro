<?php

namespace App\Domain\ReleaseNote\Models;

use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\User\Models\User;
use Database\Factories\ReleaseNoteFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReleaseNote extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return ReleaseNoteFactory::new();
    }

    /**
     * The author of the release note.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function author()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * The project that the release note belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get all of the complete tasks for the release note.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
