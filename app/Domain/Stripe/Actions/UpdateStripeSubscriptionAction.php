<?php

namespace App\Domain\Stripe\Actions;

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;

class UpdateStripeSubscriptionAction
{
    public function handle(
        User $user,
        Plan $plan,
        bool $isMonthly
    ) {
        $subscription = $user->subscription('default');
        $subscriptionItem = $subscription->items()->latest()->first();
        $providerPayload = $plan->provider_payload;

        $subscription->updateStripeSubscription(
            [
                'items' => [
                    [
                        'id' => $subscriptionItem->stripe_id,
                        'price' => $isMonthly ? $providerPayload['stripe_monthly_price_id'] : $providerPayload['stripe_yearly_price_id']
                    ],
                ],
            ]
        );

        $subscriptionItem->update([
            'stripe_product' => $providerPayload['stripe_id'],
            'stripe_price' => $providerPayload['stripe_monthly_price_id'],
        ]);

        $user->plan()->updateOrCreate([], [
            'type' => PlanTypeEnum::SUBSCRIPTION,
            'plan_id' => $plan->id,
            'provider_payload' => [
                'subscription_id' => $subscription->id,
            ]
        ]);
    }
}
