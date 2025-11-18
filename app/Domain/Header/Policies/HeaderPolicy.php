<?php

namespace App\Domain\Header\Policies;

use App\Domain\Header\Models\Header;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\User\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Str;

class HeaderPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Header $header)
    {
        $project = $header->project;

        if ($project->creator_id === $user->id) return true;

        if ($user->assignedAsTeamMemberToProjects->contains($project)) {
            $permissions = $user->permissions()->where('project_id', $project->id)->get()->pluck('pivot.permission')[0];
            return collect($permissions)->contains(
                fn ($value) => Str::contains($value, ProjectUserPermissionEnum::CAN_EDIT_CUSTOM_HEADER->value)
            );
        }

        return false;
    }
}
