<?php

namespace App\Domain\Stripe\Policies;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StripeSubscriptionPolicy
{
    use HandlesAuthorization;

    public function update(
        User $user,
        Plan $plan
    ) {
        return $plan->provider === PlanProviderEnum::STRIPE
            && (is_null($plan->projects_count) || $user->projects()->count() <= $plan->projects_count)
            && (is_null($plan->team_members_count) || $user->getTeamMembersCount() <= $plan->team_members_count)
            && (is_null($plan->community_members_count) || $user->getCommunityMembersCount() <= $plan->community_members_count);
    }

    public function create(
        User $user,
        Plan $plan
    ) {
        return $plan->provider === PlanProviderEnum::STRIPE
            && (is_null($plan->projects_count) || $user->projects()->count() <= $plan->projects_count)
            && (is_null($plan->team_members_count) || $user->getTeamMembersCount() <= $plan->team_members_count)
            && (is_null($plan->community_members_count) || $user->getCommunityMembersCount() <= $plan->community_members_count);
    }
}
