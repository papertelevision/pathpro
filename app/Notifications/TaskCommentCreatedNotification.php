<?php

namespace App\Notifications;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Models\Feature;
use App\Domain\Task\Models\Task;
use App\Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskCommentCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public User $user,
        public Task|Feature $task,
        public Comment $comment
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
        $project = $this->task->project;

        return (new MailMessage)
            ->theme('mail')
            ->subject($this->user->username . " made a new comment on a task you’ve subscribed to.")
            ->greeting(sprintf("Hello %s!", $notifiable->name))
            ->markdown(
                'task.comment.created',
                [
                    'task' => $this->task,
                    'comment' => $this->comment,
                    'project' => $project,
                    'user' => $this->user,
                    'url' => route('comment-view', [
                        'project' => $project->slug,
                        'task' => $this->task->id,
                        'comment' => $this->comment->id
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
