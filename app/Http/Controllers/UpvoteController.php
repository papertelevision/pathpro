<?php

namespace App\Http\Controllers;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Actions\AssignUserAsCommunityMemberAction;
use App\Domain\Task\Models\Task;
use App\Http\Domain\Upvote\Requests\StoreUpvoteRequest;
use App\Domain\Upvote\Models\Upvote;
use Illuminate\Http\Request;

class UpvoteController extends Controller
{
    public function store(
        StoreUpvoteRequest $request,
        AssignUserAsCommunityMemberAction $assignUserAsCommunityMemberAction,
    ) {
        $authUser = $request->user();
        $validated = $request->validated();

        $model = null;
        $upvote = null;
        if ($validated['upvotable_type'] === 'task') {
            $model = Task::find($validated['upvotable_id']);
        } else if ($validated['upvotable_type'] === 'feature') {
            $model = Feature::find($validated['upvotable_id']);
        } else if ($validated['upvotable_type'] === 'comment') {
            $model = Comment::find($validated['upvotable_id']);
        } else {
            return response(['message' => 'Unknown upvotable type.'], 400);
        }

        if (is_null($model)) {
            return response(['message' => 'Record not found.'], 404);
        }

        $project = $model->project;

        if (
            !$authUser &&
            !$project->is_public_upvoting_allowed
        ) {
            return response(['message' => 'Public voting is not allowed.'], 400);
        }

        if (
            $authUser &&
            !$authUser->assignedToProjects->contains($project)
        ) {
            $assignUserAsCommunityMemberAction->handle(
                $project,
                $authUser
            );
        }

        $upvote = $model->upvotes()->create([
            'author_id' =>  is_null($authUser) ?: $authUser->id,
            'uuid' => $validated['uuid']
        ]);

        return $upvote;
    }

    public function destroy(
        Request $request,
        Upvote $upvote,
        AssignUserAsCommunityMemberAction $assignUserAsCommunityMemberAction,
    ) {
        $authUser = $request->user();
        $project = $upvote->upvotable->project;

        if (
            !$authUser &&
            !$project->is_public_upvoting_allowed
        ) {
            return response(['message' => 'Public voting is not allowed.'], 400);
        }

        if (
            $authUser &&
            !$authUser->assignedToProjects->contains($project)
        ) {
            $assignUserAsCommunityMemberAction->handle(
                $project,
                $authUser
            );
        }

        return $upvote->delete();
    }
}
