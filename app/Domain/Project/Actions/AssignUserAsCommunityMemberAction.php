<?php

namespace App\Domain\Project\Actions;

use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;
use App\Notifications\CommunityMemberSignupNotification;
use Illuminate\Support\Facades\Notification;

class AssignUserAsCommunityMemberAction
{
    public function handle(
        Project $project,
        User $user,
    ) {
        if (
            $project->creator !== $user &&
            !$project->adminMembers->contains($user) &&
            !$project->teamMembers->contains($user) &&
            !$project->communityMembers->contains($user) &&
            !$project->bannedMembers->contains($user)
        ) {
            $user->assignedToProjects()->attach($project->id, [
                'role' =>  ProjectUserRoleEnum::communityMember,
                'rank' => UserRankEnum::COMMUNITY_MEMBER,
                'permission' => [],
                'is_joined' => true
            ]);

            Notification::send(
                $project->creator,
                new CommunityMemberSignupNotification(
                    $user,
                    $project
                )
            );
        }
    }
}
