<?php

namespace App\Notifications;

use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Enums\UserRoleEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class TeamMemberInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public TeamMemberInvitation $invitation
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
        $invitationData = [
            'invitation' => $this->invitation->id,
            'token' => $this->invitation->token,
        ];

        if ($notifiable->role === UserRoleEnum::INACTIVE) {
            $invitationData['email'] = $notifiable->email;
        }

        $invitationLink = config('app.url') . URL::signedRoute(
            $notifiable->role === UserRoleEnum::INACTIVE ? 'team-member-invitation.register' : 'team-member-invitation.login',
            $invitationData,
            absolute: false,
        );

        $projects = $this->invitation->projects;

        $subject = '';
        if ($projects->count() > 1) {
            $projectsTitles = $projects->pluck('title')->implode(', ');
            $subject = sprintf("You've been invited to the projects \"%s\"!", $projectsTitles);
        } else {
            $projectTitle = $projects->first()->title;
            $subject = sprintf("You've been invited to the project \"%s\"!", $projectTitle);
        }

        return (new MailMessage)
            ->theme('mail')
            ->subject($subject)
            ->greeting(sprintf("Hello %s!", $notifiable->name))
            ->markdown(
                'project.team-member.invitation',
                [
                    'projects' => $projects,
                    'url' => $invitationLink
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
