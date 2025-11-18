<?php

namespace App\Http\Controllers;

use App\Domain\Project\Actions\AssignUserAsCommunityMemberAction;
use App\Domain\Project\Actions\UnassignCommunityMemberAction;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Http\Domain\Project\Requests\BulkDestroyMemberRequest;
use App\Domain\User\Models\User;
use App\Domain\User\Enums\UserRankEnum;
use App\Http\Domain\User\Requests\UnassignUserFromProjectRequest;
use App\Http\Domain\User\Requests\UpdateCommunityMemberRequest;
use App\Http\Resources\CommunityMemberResource;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ProjectCommunityMemberController extends Controller
{
    public function index(
        Request $request,
    ) {
        $authUser = $request->user();
        $authUserCreatedProjects = null;
        $project = Project::where('slug', $request->input('project'))->first();
        $rank = $request->input('rank');

        if ($project) {
            if ($request->user()->cannot('viewCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        } else {
            $authUserCreatedProjects = $authUser->projects;
        }

        $communityMembers = User::where('id', '!=', auth()->id())
            ->whereHas('assignedAsCommunityMemberToProjects', function ($query) use ($rank, $project, $authUserCreatedProjects) {
                $project
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $authUserCreatedProjects->pluck('id')->toArray());

                if ($rank && $rank != 'All') {
                    $query->where('rank', $rank);
                }
            })
            ->with([
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
                    $query->where('role', ProjectUserRoleEnum::communityMember);
                },
            ])
            ->paginate(10);

        return CommunityMemberResource::collection($communityMembers);
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

        return CommunityMemberResource::make($user->load([
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
                $query->where('role', ProjectUserRoleEnum::communityMember);
            },
        ]));
    }

    public function store(
        Request $request,
        Project $project,
        AssignUserAsCommunityMemberAction $assignUserAsCommunityMemberAction
    ) {
        $authUser = $request->user();

        if (!$project->creator->canHaveCommunityMembers()) {
            abort(403, 'The project creator cannot have more community members!');
        }

        if ($project->bannedMembers->contains($authUser)) {
            abort(403, 'You are banned from this project!');
        }

        $assignUserAsCommunityMemberAction->handle(
            $project,
            $authUser
        );

        return response([
            'message' => 'success',
        ]);
    }

    public function update(
        UpdateCommunityMemberRequest $request,
        Project $project,
        User $user
    ) {
        if ($request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        $user->permissions()->where('project_id', $project->id)->update([
            'rank' => UserRankEnum::tryFrom(Str::camel($validated['rank'])),
            'is_rank_visible' => $validated['is_rank_visible']
        ]);

        return response([
            'message' => 'success',
        ]);
    }

    public function destroy(
        UnassignUserFromProjectRequest $request,
        Project $project,
        User $user,
        UnassignCommunityMemberAction $unassignCommunityMemberAction
    ) {
        if (
            $request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project]) &&
            $user->id !== $request->user()->id
        ) {
            abort(403);
        }

        $validated = $request->validated();

        $unassignCommunityMemberAction->handle(
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
        UnassignCommunityMemberAction $unassignCommunityMemberAction
    ) {
        if ($request->user()->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        foreach ($validated['members'] as $memberId) {
            $unassignCommunityMemberAction->handle(
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
