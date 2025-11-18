<?php

namespace App\Notifications;

use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomDomainRequiredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public Project $project
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->theme('mail')
            ->subject('Custom Domain Request')
            ->greeting("Hello!")
            ->markdown(
                'project.custom-domain-requested',
                [
                    'user' => $this->user,
                    'project' => $this->project,
                ]
            );
    }
}
