<?php

namespace App\Domain\Project\Actions;

use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Project\Models\ProjectUser;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;

class AssignUserToProjectAction
{
    public function handle(
        Project $project,
        User $user,
        array $permission = [],
        ?ProjectUserRoleEnum $newRole,
        ?UserRankEnum $rank = UserRankEnum::COMMUNITY_MEMBER,
    ) {
        $currentRole = ProjectUser::where([
            ['user_id', $user->id],
            ['project_id', $project->id]
        ])->first();

        if (is_null($currentRole)) {
            $user->assignedToProjects()->attach($project->id, [
                'role' => $newRole,
                'permission' => $permission,
                'rank' => $rank,
                'is_joined' => false
            ]);
        } else {
            if ($currentRole->rank === UserRankEnum::BANNED) {
                $user->assignedToProjects()->updateExistingPivot($project->id, [
                    'rank' => $currentRole->role === ProjectUserRoleEnum::communityMember ? UserRankEnum::COMMUNITY_MEMBER : NULL,
                    'is_joined' => true
                ]);
            }

            if ($newRole->rank() > $currentRole->role->rank()) {
                $user->assignedToProjects()->updateExistingPivot($project->id, [
                    'role' => $newRole,
                    'permission' => $permission,
                    'rank' => $rank,
                    'is_joined' => false
                ]);
            }
        }
    }
}
