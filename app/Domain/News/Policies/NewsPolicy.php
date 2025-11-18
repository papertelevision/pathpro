<?php

namespace App\Domain\News\Policies;

use App\Domain\News\Models\News;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class NewsPolicy
{
    use HandlesAuthorization;

    public function view(
        User $user,
        News $news,
    ) {
        $project = $news->project;

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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_EDIT_PRODUCT_NEWS->value);
            });

            return $permissionExists;
        }

        return false;
    }

    public function update(
        User $user,
        News $news
    ) {
        $project = $news->project;

        if (
            $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id
        ) {
            return true;
        }

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_EDIT_PRODUCT_NEWS->value);
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
