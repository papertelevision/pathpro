<?php

namespace App\Http\Controllers;

use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;
use App\Http\Domain\Project\Requests\BulkUpdateMemberRequest;
use App\Http\Resources\BannedMemberResource;
use Illuminate\Http\Request;

class ProjectBannedMemberController extends Controller
{
    public function index(
        Request $request,
    ) {
        $authUser = $request->user();
        $authUserCreatedProjects = null;
        $project = Project::where('slug', $request->input('project'))->first();

        if ($project) {
            if ($request->user()->cannot('viewCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        } else {
            $authUserCreatedProjects = $authUser->projects;
        }

        $bannedMembers = User::where('id', '!=', auth()->id())
            ->whereHas('bannedFromProjects', function ($query) use ($project, $authUserCreatedProjects) {
                isset($project)
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
            })
            ->with([
                'media',
            ])
            ->paginate(10);

        return BannedMemberResource::collection($bannedMembers);
    }

    public function show(
        Request $request,
        Project $project,
        User $user,
    ) {
        $authUser = $request->user();
        $project = $project->id ? $project : null;

        if ($project) {
            if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        } else {
            $hasBannedUser = $authUser->projects()->whereHas('bannedMembers', function ($query) use ($user) {
                $query->where('id', $user->id);
            })->exists();

            if (!$hasBannedUser) {
                abort(403);
            }
        }

        return BannedMemberResource::make($user->load([
            'media',
        ]));
    }

    public function update(
        Request $request,
        Project $project,
        User $user
    ) {
        $authUser = $request->user();

        if ($project->id) {
            if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
            $user->permissions()->updateExistingPivot($project->id, [
                'rank' => UserRankEnum::COMMUNITY_MEMBER,
                'role' => ProjectUserRoleEnum::communityMember,
            ]);
        } else {
            foreach ($user->bannedFromProjects as $project) {
                if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                    abort(403);
                }
                $user->permissions()->updateExistingPivot($project->id, [
                    'rank' => UserRankEnum::COMMUNITY_MEMBER,
                    'role' => ProjectUserRoleEnum::communityMember,
                ]);
            }
        }

        return response([
            'message' => 'success',
        ]);
    }

    public function bulkUpdate(
        BulkUpdateMemberRequest $request,
        Project $project,
    ) {
        $authUser = $request->user();
        $validated = $request->validated();

        if ($project->id) {
            if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }

            foreach ($validated['members'] as $memberId) {
                $member = User::find($memberId);
                if ($member) {
                    $member->permissions()->updateExistingPivot($project->id, [
                        'rank' => UserRankEnum::COMMUNITY_MEMBER,
                        'role' => ProjectUserRoleEnum::communityMember,
                    ]);
                }
            }
        } else {
            foreach ($validated['members'] as $memberId) {
                $member = User::find($memberId);
                if ($member) {
                    foreach ($member->bannedFromProjects as $project) {
                        if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                            abort(403);
                        }
                        $member->permissions()->updateExistingPivot($project->id, [
                            'rank' => UserRankEnum::COMMUNITY_MEMBER,
                            'role' => ProjectUserRoleEnum::communityMember,
                        ]);
                    }
                }
            }
        }

        return response([
            'message' => 'success',
        ]);
    }
}
