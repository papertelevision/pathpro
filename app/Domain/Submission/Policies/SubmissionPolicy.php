<?php

namespace App\Domain\Submission\Policies;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Submission\Models\Submission;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Str;

class SubmissionPolicy
{
    use HandlesAuthorization;

    public function viewAny(
        User $user,
        Paginator $submissions,
        ?Project $project
    ) {
        if (!is_null($project)) {
            return $user->assignedAsAdminOrTeamMemberToProjects->contains($project) ||
                $project->creator_id === $user->id;
        }

        if (
            $submissions->isEmpty()
        ) {
            return true;
        }

        foreach ($submissions as $submission) {
            $project = $submission->project;

            return $user->assignedAsAdminOrTeamMemberToProjects->contains($project) ||
                $project->creator_id === $user->id;
        }
    }

    public function view(
        User $user,
        Submission $submission,
    ) {
        $project = $submission->project;

        return $user->assignedAsAdminOrTeamMemberToProjects->contains($project) ||
            $project->creator_id === $user->id;
    }

    public function create(
        User $user,
        Project $project
    ) {
        return $user->assignedAsAdminToProjects->contains($project) ||
            $user->assignedAsTeamMemberToProjects->contains($project) ||
            $user->assignedAsCommunityMemberToProjects->contains($project) ||
            $project->creator_id === $user->id;
    }

    public function update(
        User $user,
        Submission $submission
    ) {
        $project = $submission->project;

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

    public function adopt(
        User $user,
        Project $project,
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
                return Str::contains($value, ProjectUserPermissionEnum::CAN_ADOPT_SUBMISSIONS->value);
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
