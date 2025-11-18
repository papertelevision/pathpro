<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Models\Feature;
use App\Domain\Task\Enums\TaskStatusEnum;
use App\Domain\Task\Actions\GetTaskOrderAction;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\TaskStatus\Models\TaskStatus;
use App\Http\Domain\Feature\Requests\ConfirmFeatureRequest;

class ConfirmedFeatureController extends Controller
{
    public function store(
        ConfirmFeatureRequest $request,
        Feature $feature,
        GetTaskOrderAction $getTaskOrderAction
    ) {
        $validated = $request->validated();

        if ($validated['add_to_roadmap']) {
            $taskGroup = TaskGroup::find($validated['task_group_id']);
            $taskStatus = TaskStatus::where('title', TaskStatusEnum::DEVELOPMENT->label())->first();

            $task = $taskGroup->tasks()->create([
                'order' => $getTaskOrderAction->handle($taskGroup),
                'title' => $feature->title,
                'description' => $feature->description,
                'project_id' => $feature->project_id,
                'task_type_id' => $feature->feature_type_id,
                'task_status_id' => $taskStatus->id,
                'visibility' => TaskGroupVisibilityEnum::PUBLISHED,
                'are_subtasks_allowed' => false,
                'is_task_upvoting_enabled' => false,
            ]);

            foreach ($feature->comments as $comment) {
                $comment->update([
                    'commentable_id' => $task->id,
                    'commentable_type' => Task::class,
                ]);
            }

            foreach ($feature->upvotes as $upvote) {
                $upvote->update([
                    'upvotable_id' => $task->id,
                    'upvotable_type' => Task::class,
                ]);
            }

            foreach ($feature->subscribers as $subscriber) {
                $subscriber->update([
                    'subscribable_id' => $task->id,
                    'subscribable_type' => Task::class,
                ]);
            }

            foreach ($feature->communityMembers as $member) {
                $task->communityMembers()->attach($member->id);
            }

            $feature->delete();
        } else {
            $feature->update([
                'is_task_confirmed' => true
            ]);
        }

        return response([
            'message' => 'success',
        ]);
    }
}
