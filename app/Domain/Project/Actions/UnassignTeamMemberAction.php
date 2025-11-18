<?php

namespace App\Domain\Project\Actions;

use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;

class UnassignTeamMemberAction
{
    public function handle(
        bool $wipeMemberContent = false,
        bool $banMember = false,
        Project $project,
        User $member,
    ) {
        if ($wipeMemberContent) {
            foreach ($project->tasks as $task) {
                $this->destroyCommentsAndUpvotes($task, $member);
                $task->teamMembers()->detach($member);
            }
            foreach ($project->features as $feature) {
                $this->destroyCommentsAndUpvotes($feature, $member);
            }

            $project->releaseNotes()->where('author_id', $member->id)->delete();
            $project->news()->where('author_id', $member->id)->delete();
            $project->submissions()->where('author_id', $member->id)->delete();
        } else {
            foreach ($project->tasks as $task) {
                $task->teamMembers()->detach($member);
            }
        }

        $banMember
            ? $member->permissions()->updateExistingPivot($project->id, [
                'rank' => UserRankEnum::BANNED
            ])
            : $member->permissions()->detach($project->id);

        $invitations = $member->invitations()->whereHas('projects', function ($query) use ($project) {
            $query->where('project_id', $project->id);
        })->get();

        if ($invitations->isNotEmpty()) {
            $invitations->each(function ($invitation) use ($project) {
                $invitation->projects()->detach($project->id);

                if ($invitation->projects->isEmpty()) {
                    $invitation->delete();
                }
            });
        }
    }

    private function destroyCommentsAndUpvotes(
        Task|Feature $model,
        User $member,
    ) {
        $comments = $model->comments()->where('author_id', $member->id)->get();
        if ($comments->count() > 0) {
            foreach ($comments as $comment) {
                $comment->upvotes()->where('author_id', $member->id)->delete();
                $comment->delete();
            }
        }
        $model->upvotes()->where('author_id', $member->id)->delete();
    }
}
