<?php

namespace App\Domain\Project\Policies;

use App\Domain\Project\Enums\ProjectVisibilityEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function view(?User $user, Project $project)
    {
        if (
            $project->visibility === ProjectVisibilityEnum::PRIVATE &&
            (!auth()->check() ||
                $user->assignedAsCommunityMemberToProjects->contains($project))
        ) {
            return false;
        }

        if (
            $project->visibility === ProjectVisibilityEnum::ARCHIVED &&
            (!auth()->check() || $user?->id != $project->creator_id)
        ) {
            return false;
        }

        if (auth()->check()) {
            return $user->assignedAsAdminToProjects->contains($project) ||
                $user->assignedAsTeamMemberToProjects->contains($project) ||
                $user->assignedAsCommunityMemberToProjects->contains($project) ||
                $project->creator_id === $user->id;
        }

        return true;
    }

    public function create(User $user)
    {
        return $user->hasPlan() && $user->canCreateProjects();
    }

    public function update(User $user, Project $project)
    {
        return $project->creator_id === $user->id;
    }

    public function delete(User $user, Project $project)
    {
        return $project->creator_id === $user->id;
    }
}
