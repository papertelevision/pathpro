<?php

namespace App\Domain\TeamMemberInvitation\Actions;

use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Models\User;
use App\Notifications\TeamMemberInvitationAcceptedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class DestroyTeamMemberInvitationAction
{
    public function handle(
        TeamMemberInvitation $teamMemberInvitation,
        User $user
    ) {
        if ($user->email !== $teamMemberInvitation->user->email) {
            Auth::logout();
            abort(403, 'You cannot join the project/s with that email address!');
        }

        foreach ($teamMemberInvitation->projects as $project) {
            $members = $project->adminMembers->merge($project->teamMembers);
            foreach ($members as $member) {
                Notification::send(
                    $member,
                    new TeamMemberInvitationAcceptedNotification(
                        $user,
                        $project
                    )
                );
            }

            if ($project->teamMembers->contains($user)) {
                $user?->permissions()->updateExistingPivot($project->id, [
                    'is_joined' => true
                ]);
            }
        }

        $teamMemberInvitation->delete();
    }
}
