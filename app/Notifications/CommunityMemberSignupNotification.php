<?php

namespace App\Notifications;

use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityMemberSignupNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public User $user,
        public Project $project,
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
            ->subject('A new community member has joined your project!')
            ->greeting(sprintf("Hello %s!", $notifiable->name))
            ->markdown(
                'project.community-member.signup',
                [
                    'user' => $this->user,
                    'project' => $this->project,
                    'url' => route('community-member.show', [
                        'project' => $this->project,
                        'user' => $this->user,
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
