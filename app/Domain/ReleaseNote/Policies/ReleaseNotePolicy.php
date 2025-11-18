<?php

namespace App\Domain\ReleaseNote\Policies;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class ReleaseNotePolicy
{
    use HandlesAuthorization;

    public function view(
        User $user,
        ReleaseNote $releaseNote,
    ) {
        $project = $releaseNote->project;

        return
            $project->creator_id === $user->id ||
            $user->assignedAsAdminToProjects->contains($project) ||
            $user->assignedAsTeamMemberToProjects->contains($project);
    }

    public function create(
        User $user,
        Project $project
    ) {
        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_UPDATE_RELEASE_NOTES->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function update(
        User $user,
        ReleaseNote $releaseNote
    ) {
        $project = $releaseNote->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_UPDATE_RELEASE_NOTES->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function delete(
        User $user,
        Project $project
    ) {
        return
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id;
    }
}
