<?php

namespace App\Domain\Stripe\Models;

use Laravel\Cashier\SubscriptionItem;

class StripeSubscriptionItem extends SubscriptionItem
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stripe_subscription_items';
}
