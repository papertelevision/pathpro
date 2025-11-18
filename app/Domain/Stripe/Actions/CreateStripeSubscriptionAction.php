<?php

namespace App\Domain\Stripe\Actions;

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;

class CreateStripeSubscriptionAction
{
    public function handle(
        User $user,
        Plan $plan,
        bool $isMonthly = true,
        ?string $paymentMethodId = null,
        ?string $coupon = null
    ) {
        $user->createOrGetStripeCustomer();
        $providerPayload = $plan->provider_payload;

        $subscription = $user->newSubscription(
            'default',
            $isMonthly ? $providerPayload['stripe_monthly_price_id'] : $providerPayload['stripe_yearly_price_id']
        );

        if ($coupon) {
            $subscription->withCoupon($coupon);
        }

        $subscription = $subscription->create(
            $plan->isFree() ? null : $paymentMethodId
        );

        $user->plan()->updateOrCreate([], [
            'type' => PlanTypeEnum::SUBSCRIPTION,
            'plan_id' => $plan->id,
            'provider_payload' => [
                'subscription_id' => $subscription->id,
            ]
        ]);
    }
}
