<?php

namespace App\Http\Resources;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Enums\PlanTypeEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanUserResource extends JsonResource
{
    public function toArray($request)
    {
        $plan = $this->plan;
        $isSubscription = $this->type === PlanTypeEnum::SUBSCRIPTION;

        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => $plan->price / 100,
            'is_free' => $plan->isFree(),
            'features' => $plan->features,
            'subscription' => $isSubscription ? StripeSubscriptionResource::make($request->user()->lastSubscription) : null,
            'is_recommended' => $this->is_recommended,
            'tech_support_type' => $this->tech_support_type,
            'projects_count' => is_null($plan->projects_count) ?  'UNLIMITED' : $plan->projects_count,
            'team_members_count' => is_null($plan->team_members_count) ?  'UNLIMITED' : $plan->team_members_count,
            'community_members_count' => is_null($plan->community_members_count) ? 'UNLIMITED' : $plan->community_members_count,
            'is_provider_stripe' => $plan->provider === PlanProviderEnum::STRIPE,
            'is_provider_appsumo' => $plan->provider === PlanProviderEnum::APPSUMO,
        ];
    }
}
