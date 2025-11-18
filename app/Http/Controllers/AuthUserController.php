<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\User\Actions\CheckPageWhiteLabelingAction;
use App\Domain\User\Enums\UserRankEnum;
use App\Http\Domain\User\Requests\UpdateUserRequest;
use App\Http\Resources\AuthUserResource;
use Illuminate\Http\Request;

class AuthUserController extends Controller
{
    public function show(
        Request $request,
        CheckPageWhiteLabelingAction $checkPageWhiteLabelingAction
    ) {
        $projectSlug = $request->input('project');
        $project = null;
        
        // Only try to find project if we have a valid slug (not 'undefined' or empty)
        if ($projectSlug && $projectSlug !== 'undefined') {
            $project = Project::where('slug', $projectSlug)->first();
        }
        $user = $request->user()
            ->loadCount('projects')
            ->load([
                'media',
                'permissions' => function ($query) {
                    $query->where('rank', '!=', UserRankEnum::BANNED)
                        ->orWhereNull('rank');
                },
                'plan.plan',
            ]);

        if (
            !is_null($project) &&
            (
                $user->assignedAsCommunityMemberToProjects->contains($project) ||
                $user->assignedAsAdminToProjects->contains($project) ||
                $user->assignedAsTeamMemberToProjects->contains($project)
            )
        ) {
            $user->load([
                'submissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'adoptedSubmissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'upvotedTasksAndFeatures' => function ($query) use ($project) {
                    $query->ofTypeTaskAndFeatureByProjects($project);
                },
                'upvotedComments' => function ($query) use ($project) {
                    $query->ofTypeCommentByProjects($project);
                },
                'comments' => function ($query) use ($project) {
                    $query->ofTypeTaskAndFeatureByProjects($project);
                },
            ]);
        }

        $user->is_page_white_labeled = $checkPageWhiteLabelingAction->handle();

        return AuthUserResource::make($user);
    }

    public function finishOnboarding(
        Request $request
    ) {
        $request->user()->update([
            'has_finished_onboarding' => $request->input('has_finished_onboarding')
        ]);

        return response([
            'message' => 'success',
        ]);
    }

    public function update(
        UpdateUserRequest $request
    ) {
        $request->user()->update($request->validated());

        return response([
            'message' => 'success',
        ]);
    }
}
