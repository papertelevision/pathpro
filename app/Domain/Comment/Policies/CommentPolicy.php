<?php

namespace App\Domain\Comment\Policies;

use App\Domain\Comment\Models\Comment;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class CommentPolicy
{
    use HandlesAuthorization;

    public function create(
        User $user,
        Project $project
    ) {
        return $user->assignedAsAdminToProjects->contains($project) ||
            $user->assignedAsTeamMemberToProjects->contains($project) ||
            $user->assignedAsCommunityMemberToProjects->contains($project) ||
            $project->creator_id === $user->id;
    }

    public function delete(
        User $user,
        Comment $comment
    ) {
        $project = $comment->project;

        if ($project->creator_id === $user->id) return true;

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            $permissionExists = collect($permissions)->contains(function ($value) {
                return Str::contains($value, ProjectUserPermissionEnum::CAN_DELETE_COMMENTS->value);
            });

            return $permissionExists;
        }

        return false;
    }
}
