<?php

namespace App\Domain\News\Models;

use App\Domain\News\Enums\NewsStatusEnum;
use App\Domain\News\QueryBuilders\NewsQueryBuilder;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use HasFactory,
        SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'status' => NewsStatusEnum::class,
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return NewsFactory::new();
    }

    /**
     * Create a new Eloquent query builder for the model.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return \App\Domain\News\QueryBuilders\NewsQueryBuilder
     */
    public function newEloquentBuilder($query): NewsQueryBuilder
    {
        return new NewsQueryBuilder($query);
    }

    /**
     * The author of the news.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * The project that the news belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
