<?php

namespace App\Domain\Project\Actions;

use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;

class UnassignCommunityMemberAction
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
                $task->communityMembers()->detach($member);
            }
            foreach ($project->features as $feature) {
                $this->destroyCommentsAndUpvotes($feature, $member);
                $feature->communityMembers()->detach($member);
            }
            $project->submissions()->where('author_id', $member->id)->delete();
        } else {
            foreach ($project->tasks as $task) {
                $task->communityMembers()->detach($member);
            }
            foreach ($project->features as $feature) {
                $feature->communityMembers()->detach($member);
            }
        }

        $banMember
            ? $member->permissions()->updateExistingPivot($project->id, [
                'rank' => UserRankEnum::BANNED
            ])
            : $member->permissions()->detach($project->id);
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
