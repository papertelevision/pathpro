<?php

namespace App\Notifications;

use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReleaseNoteCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Project $project;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public ReleaseNote $releaseNote,
    ) {
        $this->project = $releaseNote->project;
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
            ->subject(sprintf("%s has Published A New Release!", $this->project->title))
            ->greeting('Greetings!')
            ->markdown(
                'release-note.created',
                [
                    'project' => $this->project,
                    'url' => route('web.release-notes.index', [
                        'project' => $this->project,
                    ]),
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
