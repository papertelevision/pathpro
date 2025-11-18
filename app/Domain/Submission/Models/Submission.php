<?php

namespace App\Domain\Submission\Models;

use App\Domain\Project\Models\Project;
use App\Domain\Submission\Enums\SubmissionStatusEnum;
use App\Domain\Submission\QueryBuilders\SubmissionQueryBuilder;
use App\Domain\User\Models\User;
use Database\Factories\SubmissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Submission extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'status' => SubmissionStatusEnum::class,
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return SubmissionFactory::new();
    }

    /**
     * Create a new Eloquent query builder for the model.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return \App\Domain\Submission\QueryBuilders\SubmissionQueryBuilder
     */
    public function newEloquentBuilder($query): SubmissionQueryBuilder
    {
        return new SubmissionQueryBuilder($query);
    }

    /**
     * The author of the submission.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function author()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * The project that the submission belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Check if the submission is adopted.
     *
     * @return bool
     */
    public function isAdopted(): bool
    {
        return $this->status === SubmissionStatusEnum::ROADMAP ||
            $this->status === SubmissionStatusEnum::VOTING;
    }

    /**
     * Check if the submission is denied.
     *
     * @return bool
     */
    public function isDenied(): bool
    {
        return $this->status === SubmissionStatusEnum::DENIED;
    }
}
