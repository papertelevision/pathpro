<?php

namespace App\Domain\Feature\Policies;

use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class FeaturePolicy
{
    use HandlesAuthorization;

    public function view(
        ?User $user,
        Feature $feature
    ) {
        $project = $feature->project;

        if (
            $feature->visibility === FeatureVisibilityEnum::DRAFT &&
            (!auth()->check() ||
                $user->assignedAsCommunityMemberToProjects->contains($project))
        ) {
            return false;
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
        Feature $feature
    ) {
        $project = $feature->project;

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
        Feature $feature
    ) {
        $project = $feature->project;

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

    public function confirm(
        User $user,
        Feature $feature
    ) {
        $project = $feature->project;

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
