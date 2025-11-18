<?php

namespace App\Domain\Submission\QueryBuilders;

use App\Domain\Submission\Enums\SubmissionStatusEnum;
use Illuminate\Database\Eloquent\Builder;

class SubmissionQueryBuilder extends Builder
{
    public function new()
    {
        return $this->whereIn('status', [SubmissionStatusEnum::NEW, NULL])->where('is_highlighted', false);
    }

    public function adopted(): self
    {
        return $this->whereIn('status', [SubmissionStatusEnum::ROADMAP, SubmissionStatusEnum::VOTING]);
    }

    public function highlighted(): self
    {
        return $this->where('is_highlighted', true);
    }
}
