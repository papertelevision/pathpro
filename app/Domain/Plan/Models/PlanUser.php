<?php

namespace App\Domain\Plan\Models;

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class PlanUser extends Model
{
    protected $casts = [
        'type' => PlanTypeEnum::class,
        'provider_payload' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function isFree(): bool
    {
        return $this->plan->isFree();
    }

    public function isWhiteLabeled(): bool
    {
        return $this->plan->is_white_labeled;
    }

    public function scopeSubscription($query): Builder
    {
        return $query->where('type', PlanTypeEnum::SUBSCRIPTION);
    }

    public function scopeLifetime($query): Builder
    {
        return $query->where('type', PlanTypeEnum::LIFETIME);
    }
}
