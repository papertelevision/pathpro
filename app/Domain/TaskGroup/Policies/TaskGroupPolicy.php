<?php

namespace App\Domain\TaskGroup\Policies;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class TaskGroupPolicy
{
    use HandlesAuthorization;

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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASK_GROUPS->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function update(
        User $user,
        TaskGroup $taskGroup
    ) {
        $project = $taskGroup->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASK_GROUPS->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function updateBulk(
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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASK_GROUPS->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function delete(
        User $user,
        TaskGroup $taskGroup
    ) {
        $project = $taskGroup->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASK_GROUPS->value);
            });

            return $permissionExists;
        }

        return false;
    }
}
