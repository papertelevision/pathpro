<?php

namespace App\Http\Controllers;

use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Project\Models\ProjectUser;
use App\Http\Resources\UserResource;
use App\Domain\User\Models\User;
use Illuminate\Http\Request;

class UnassignedUserController extends Controller
{
    public function index(
        Request $request
    ) {
        $authUser = $request->user();
        $projectSlug = $request->input('project');

        $projectsIds = $authUser->projects()
            ->when($projectSlug, function ($query) use ($projectSlug) {
                $query->where('slug', '!=', $projectSlug);
            })
            ->select('id')
            ->get()
            ->pluck('id')
            ->toArray();

        $members = ProjectUser::whereIn('project_id', $projectsIds)
            ->whereIn('role', [ProjectUserRoleEnum::admin, ProjectUserRoleEnum::teamMember, ProjectUserRoleEnum::communityMember])
            ->where('user_id', '!=', $authUser->id)
            ->select('user_id')
            ->get()
            ->pluck('user_id')
            ->toArray();

        $users = User::whereIn('id', $members)
            ->with([
                'media'
            ])
            ->get();

        return UserResource::collection($users);
    }
}
