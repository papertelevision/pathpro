<?php

namespace App\Domain\Plan\Policies;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlanPolicy
{
    use HandlesAuthorization;

    public function purchaseStripePlan(
        User $user,
        Plan $plan
    ) {
        return $plan->provider === PlanProviderEnum::STRIPE
            && (!$user->hasPlan() || $user->plan?->isFree())
            && (is_null($plan->projects_count) || $user->projects()->count() <= $plan->projects_count)
            && (is_null($plan->team_members_count) || $user->getTeamMembersCount() <= $plan->team_members_count)
            && (is_null($plan->community_members_count) || $user->getCommunityMembersCount() <= $plan->community_members_count);
    }
}
