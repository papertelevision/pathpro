<?php

namespace App\Notifications;

use App\Domain\Plan\Models\Plan;
use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StripeProductPurchaseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Plan $plan,
        public User $user
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->theme('mail')
            ->subject('Plan purchase at ' . config('app.name') . '.com')
            ->greeting(sprintf("Hello %s!", $notifiable->name))
            ->markdown(
                'stripe.product.purchase',
                [
                    'user' => $this->user,
                    'stripeProduct' => $this->plan,
                    'stripeProductUrl' => route('filament.admin.resources.stripe-products.edit', [
                        'record' => $this->plan
                    ]),
                    'url' => route('filament.admin.resources.users.edit', [
                        'record' => $this->user
                    ])
                ]
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
