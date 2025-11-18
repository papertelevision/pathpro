<?php

namespace App\Notifications;

use App\Domain\Project\Models\Project;
use App\Domain\Submission\Models\Submission;
use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubmissionCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Project $project;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public User $user,
        public Submission $submission,
    ) {
        $this->project = $submission->project;
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
            ->subject('New Feature Submission Received!')
            ->greeting('Greetings!')
            ->markdown(
                'submission.created-by-community-member',
                [
                    'user' => $this->user,
                    'project' => $this->project,
                    'url' =>  route('submission.show', [
                        'project' => $this->project,
                        'submission' => $this->submission,
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
