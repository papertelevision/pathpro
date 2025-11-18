<?php

namespace App\Domain\Task\Policies;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Enums\ProjectVisibilityEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class TaskPolicy
{
    use HandlesAuthorization;

    public function view(
        ?User $user,
        Task $task
    ) {
        $project = $task->project;

        if (
            $task->visibility === TaskGroupVisibilityEnum::DRAFT &&
            (!auth()->check() ||
                $user->assignedAsCommunityMemberToProjects->contains($project))
        ) {
            return false;
        }

        if (
            $task->visibility === TaskGroupVisibilityEnum::ARCHIVED &&
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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASKS_FEATURES->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function update(
        User $user,
        Task $task
    ) {
        $project = $task->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASKS_FEATURES->value);
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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASKS_FEATURES->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function delete(
        User $user,
        Task $task
    ) {
        $project = $task->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_CREATE_EDIT_TASKS_FEATURES->value);
            });

            return $permissionExists;
        }

        return false;
    }
}
