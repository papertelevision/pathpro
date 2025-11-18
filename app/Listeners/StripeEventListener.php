<?php

namespace App\Listeners;

use App\Domain\Plan\Models\PlanUser;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Notifications\TransactionSuccessfulNotification;
use Illuminate\Support\Facades\Notification;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    public function handle(
        WebhookReceived $event
    ): void {
        $eventType = $event->payload['type'];
        $object = $event->payload['data']['object'];

        if ($eventType == 'invoice.payment_succeeded') {
            $this->paymentSucceeded($object);
        }

        if ($eventType == 'customer.subscription.deleted') {
            $this->subscriptionDeleted($object);
        }
    }

    protected function paymentSucceeded(array $invoice): void
    {
        $customer = User::where('stripe_id', $invoice['customer'])->first();
        $amount = $invoice['amount_paid'];

        if ($customer) {
            $superAdmin = User::where('role', UserRoleEnum::SUPER_ADMIN)->first();

            Notification::send(
                [$superAdmin, $customer],
                new TransactionSuccessfulNotification(
                    $customer,
                    $amount
                )
            );
        }
    }

    protected function subscriptionDeleted(array $subscription): void
    {
        $subscription = StripeSubscription::where('stripe_id', $subscription['id'])->first();

        PlanUser::query()
            ->subscription()
            ->where('provider_payload->subscription_id', $subscription->id)
            ->delete();
    }
}
