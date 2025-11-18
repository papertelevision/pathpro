<?php

namespace App\Domain\News\QueryBuilders;

use App\Domain\News\Enums\NewsStatusEnum;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;

class NewsQueryBuilder extends Builder
{
    /**
     * Scope a query to only include news with a given status.
     *
     * @param  \App\Domain\News\Enums\NewsStatusEnum  $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function withStatus(NewsStatusEnum $status): self
    {
        return $this->where('status', $status);
    }

    /**
     * Scope a query to only include news by a given author.
     *
     * @param  \App\Domain\User\Models\User $user
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function byAuthor(User $user): self
    {
        return $this->where('author_id', $user->id);
    }
}
