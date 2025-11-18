<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\Task\Actions\GetTaskOrderAction;
use App\Domain\Task\Models\Task;
use App\Events\CommentCreatedEvent;
use App\Http\Domain\Task\Requests\StoreSubtaskRequest;
use App\Http\Domain\Task\Requests\UpdateSubtaskRequest;
use App\Http\Resources\TaskResource;

class SubtaskController extends Controller
{
    public function show(
        Task $subtask
    ): TaskResource {
        return TaskResource::make($subtask->load([
            'taskType',
            'taskStatus',
            'teamMembers.media',
            'communityMembers.media',
        ]));
    }

    public function store(
        StoreSubtaskRequest $request,
        Project $project,
        GetTaskOrderAction $getTaskOrderAction
    ) {
        if ($request->user()->cannot('create', [Task::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();
        $parentTask = Task::find($validated['parent_task_id']);
        $taskGroup = $parentTask->taskGroup;

        $subtask = $project->tasks()->create([
            'creator_id' => $request->user()->id,
            'order' => $getTaskOrderAction->handle($taskGroup, $parentTask),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'task_group_id' => $taskGroup->id,
            'task_type_id' => $validated['task_type_id'],
            'task_status_id' => $validated['task_status_id'],
            'parent_task_id' => $parentTask->id,
            'visibility' => $validated['visibility'],
            'are_subtasks_allowed' => false,
            'is_task_upvoting_enabled' => false,
            'are_comments_enabled' => $validated['are_comments_enabled'],
            'are_stats_public' => $validated['are_stats_public'],
            'is_comment_upvoting_allowed' => $validated['is_comment_upvoting_allowed'],
            'are_team_members_visible' => $validated['are_team_members_visible'],
            'is_creator_visible' => $validated['is_creator_visible'],
        ]);

        // Handle file attachments
        if (isset($validated['attachments']) && is_array($validated['attachments'])) {
            foreach ($validated['attachments'] as $attachment) {
                $subtask->addMedia($attachment)->toMediaCollection('attachments');
            }
        }

        if ($validated['has_first_comment']) {
            $comment = $subtask->comments()->create([
                'author_id' => $request->user()->id,
                'content' => $validated['comment_content'],
                'is_comment_pinned_to_top' => $validated['is_comment_pinned_to_top'],
            ]);

            event(new CommentCreatedEvent([
                'subscribable' => $subtask,
                'comment' => $comment,
            ]));
        }

        $subtask->teamMembers()->sync([]);
        $subtask->teamMembers()->sync($validated['team_members']);

        $subtask->communityMembers()->sync([]);
        $subtask->communityMembers()->sync($validated['community_members']);

        return $subtask->id;
    }

    public function update(
        UpdateSubtaskRequest $request,
        Task $task
    ) {
        $validated = $request->validated();

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'task_type_id' => $validated['task_type_id'],
            'task_status_id' => $validated['task_status_id'],
            'visibility' => $validated['visibility'],
            'is_task_upvoting_enabled' => $validated['is_task_upvoting_enabled'],
            'are_stats_public' => $validated['are_stats_public'],
            'are_comments_enabled' => $validated['are_comments_enabled'],
            'is_comment_upvoting_allowed' => $validated['is_comment_upvoting_allowed'],
            'are_team_members_visible' => $validated['are_team_members_visible'],
            'is_creator_visible' => $validated['is_creator_visible'],
        ]);

        // Handle file attachments
        if (isset($validated['attachments']) && is_array($validated['attachments'])) {
            foreach ($validated['attachments'] as $attachment) {
                $task->addMedia($attachment)->toMediaCollection('attachments');
            }
        }

        $task->teamMembers()->sync([]);
        $task->teamMembers()->sync($validated['team_members'] ?? []);

        $task->communityMembers()->sync([]);
        $task->communityMembers()->sync($validated['community_members'] ?? []);

        return response([
            'message' => 'success',
        ]);
    }

    public function destroy(Task $task)
    {
        $task->delete();
    }
}
