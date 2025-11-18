<?php

namespace App\Notifications;

use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionSuccessfulNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $customer,
        public string $transactionAmountInCents
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subscription = $this->customer->lastSubscription;
        $stripeProduct = $subscription->product;
        $isMonthlySubscription = $subscription->asStripeSubscription()->items->data[0]->price->recurring->interval  === 'month';

        if ($notifiable->isSuperAdmin()) {
            return (new MailMessage)
                ->theme('mail')
                ->subject('A user has purchased a ' . config('app.name') . ' account!')
                ->greeting("Hello!")
                ->markdown(
                    'stripe.transaction.super-admin.successful',
                    [
                        'customer' => $this->customer,
                        'stripeProduct' => $stripeProduct,
                        'stripeProductAmount' => $isMonthlySubscription
                            ? '$' . to_dollars($stripeProduct->price) . ' per month'
                            : '$' . to_dollars($stripeProduct->getDiscountedMonthlyPrice()) . ' per year',
                        'transactionAmount' => to_dollars($this->transactionAmountInCents)
                    ]
                );
        }

        return (new MailMessage)
            ->theme('mail')
            ->subject('Welcome to ' . config('app.name') . '!')
            ->greeting("Hello " . $this->customer->username . '!')
            ->markdown(
                'stripe.transaction.customer.successful',
                [
                    'stripeProduct' => $stripeProduct,
                    'stripeProductAmount' => $isMonthlySubscription
                        ? '$' . to_dollars($stripeProduct->price) . ' per month'
                        : '$' . to_dollars($stripeProduct->getDiscountedMonthlyPrice()) . ' per year',
                    'transactionAmount' => to_dollars($this->transactionAmountInCents)
                ]
            );
    }
}
