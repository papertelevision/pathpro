<?php

namespace App\Domain\Stripe\Models;

use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Laravel\Cashier\Subscription;

class StripeSubscription extends Subscription
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stripe_subscriptions';

    /**
     * The subscriber.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription items related to the subscription.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(StripeSubscriptionItem::class, 'subscription_id');
    }

    /**
     * Get the stripe product related to the subscription.
     *
     * @return Illuminate\Database\Eloquent\Relations\HasOneThrough
     */
    public function product(): HasOneThrough
    {
        return $this->hasOneThrough(
            Plan::class,
            StripeSubscriptionItem::class,
            'subscription_id',
            'provider_payload->stripe_id',
            'id',
            'stripe_product'
        );
    }

    /**
     * Check if the subscription is free.
     *
     * @return Illuminate\Database\Eloquent\Relations\HasOneThrough
     */
    public function isFree(): bool
    {
        return $this->product->isFree();
    }
}
