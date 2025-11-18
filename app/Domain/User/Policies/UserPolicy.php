<?php

namespace App\Domain\User\Policies;

use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function manageCommunityAndTeamMembers(
        User $authUser,
        Project $project,
    ) {
        return
            $authUser->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $authUser->id;
    }

    public function viewCommunityAndTeamMembers(
        User $authUser,
        Project $project,
    ) {
        return
            $authUser->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $authUser->id;
    }
}
