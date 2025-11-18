<?php

namespace App\Listeners;

use App\Events\CommentCreatedEvent;
use App\Domain\User\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskCommentCreatedNotification;

class CommentCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  CommentCreatedEvent  $event
     * @return void
     */
    public function handle(CommentCreatedEvent $event)
    {
        $subscribable = $event->data['subscribable'];

        foreach ($subscribable->subscribers as $subscriber) {
            if ($subscriber->user_id == auth()->id()) {
                continue;
            }

            Notification::send(
                User::find($subscriber->user_id),
                new TaskCommentCreatedNotification(
                    auth()->user(),
                    $subscribable,
                    $event->data['comment']
                )
            );
        }
    }
}
