<?php

namespace App\Http\Controllers;

use App\Domain\Project\Actions\UnassignTeamMemberAction;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;
use App\Http\Domain\Project\Requests\BulkDestroyMemberRequest;
use App\Http\Domain\User\Requests\UnassignUserFromProjectRequest;
use App\Http\Domain\User\Requests\UpdateTeamMemberRequest;
use App\Http\Resources\TeamMemberResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectTeamMemberController extends Controller
{
    public function index(
        Request $request,
    ) {
        $authUser = $request->user();
        $authUserCreatedProjects = null;
        $project = Project::where('slug', $request->input('project'))->first();

        if (isset($project)) {
            if ($request->user()->cannot('viewCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        } else {
            $authUserCreatedProjects = $authUser->projects;
        }

        $teamMembers = User::where('id', '!=', auth()->id())
            ->whereHas('assignedAsJoinedOrUnjoinedTeamMemberToProjects', function ($query) use ($project, $authUserCreatedProjects) {
                isset($project)
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
            })
            ->with([
                'media',
                'permissions' => function ($query) use ($project, $authUserCreatedProjects) {
                    $query = isset($project)
                        ? $query->where('project_id', $project->id)
                        : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
                    $query->where('role', ProjectUserRoleEnum::teamMember);
                },
            ])
            ->paginate(10);

        return TeamMemberResource::collection($teamMembers);
    }

    public function show(
        Request $request,
        Project $project,
        User $user,
    ) {
        $authUser = $request->user();
        $authUserCreatedProjects = null;
        $project = $project->id ? $project : null;

        if ($project) {
            if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        } else {
            $authUserCreatedProjects = $authUser->projects;
        }

        return TeamMemberResource::make($user->load([
            'media',
            'submissions' => function ($query) use ($project, $authUserCreatedProjects) {
                $project
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
            },
            'adoptedSubmissions' => function ($query) use ($project, $authUserCreatedProjects) {
                $project
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
            },
            'upvotedTasksAndFeatures' => function ($query) use ($project, $authUserCreatedProjects) {
                $query->ofTypeTaskAndFeatureByProjects($project, $authUserCreatedProjects);
            },
            'upvotedComments' => function ($query) use ($project, $authUserCreatedProjects) {
                $query->ofTypeCommentByProjects($project, $authUserCreatedProjects);
            },
            'comments' => function ($query) use ($project, $authUserCreatedProjects) {
                $query->ofTypeTaskAndFeatureByProjects($project, $authUserCreatedProjects);
            },
            'permissions' => function ($query) use ($project, $authUserCreatedProjects) {
                $query = isset($project)
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());
                $query->where('role', ProjectUserRoleEnum::teamMember);
            },
        ]));
    }

    public function update(
        UpdateTeamMemberRequest $request,
        User $user
    ) {
        $validated = $request->validated();
        $project = null;
        $availablePermissions = ProjectUserPermissionEnum::values();

        foreach ($validated['permissions'] as $permission) {
            $project = Project::find($permission['project_id']);

            if ($request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }

            $filteredPermissions = collect($permission['permission'])
                ->intersect($availablePermissions)
                ->filter()
                ->toArray();

            $user->permissions()->updateExistingPivot($project->id, [
                'permission' => $filteredPermissions
            ]);
        }

        $rank = UserRankEnum::tryFrom(Str::camel($validated['rank']));
        if ($rank) {
            $user->permissions()->updateExistingPivot($project->id, [
                'rank' => $rank,
                'is_rank_visible' => $validated['is_rank_visible']
            ]);
        }

        return response([
            'message' => 'success',
        ]);
    }

    public function destroy(
        UnassignUserFromProjectRequest $request,
        Project $project,
        User $user,
        UnassignTeamMemberAction $unassignTeamMemberAction
    ) {
        if ($request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        $unassignTeamMemberAction->handle(
            $validated['wipe_member_content'],
            $validated['ban_member'],
            $project,
            $user
        );

        return response([
            'message' => 'success',
        ]);
    }

    public function bulkDestroy(
        BulkDestroyMemberRequest $request,
        Project $project,
        UnassignTeamMemberAction $unassignTeamMemberAction
    ) {
        if ($request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        foreach ($validated['members'] as $memberId) {
            $unassignTeamMemberAction->handle(
                $validated['wipe_members_content'],
                $validated['ban_members'],
                $project,
                User::find($memberId)
            );
        }

        return response([
            'message' => 'success',
        ]);
    }
}
