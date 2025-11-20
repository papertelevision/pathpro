<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\Task\Actions\AssignUsersToTaskAction;
use App\Domain\Task\Actions\GetTaskOrderAction;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Events\CommentCreatedEvent;
use App\Http\Domain\Task\Requests\StoreTaskRequest;
use App\Http\Domain\Task\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    public function show(
        Task $task
    ) {
        $task->loadCount([
            'children',
        ])->load([
            'taskGroup.media',
            'taskType',
            'taskStatus',
            'teamMembers.media',
            'communityMembers.media',
            'upvotes',
            'subscribers',
        ]);

        return new TaskResource($task);
    }

    public function store(
        StoreTaskRequest $request,
        Project $project,
        GetTaskOrderAction $getTaskOrderAction,
        AssignUsersToTaskAction $assignUsersToTaskAction,
    ) {
        $user = $request->user();

        if ($user->cannot('create', [Task::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        $task = $project->tasks()->create([
            'creator_id' => $user->id,
            'order' => $getTaskOrderAction->handle(TaskGroup::find($validated['task_group_id'])),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'task_group_id' => $validated['task_group_id'],
            'task_type_id' => $validated['task_type_id'],
            'task_status_id' => $validated['task_status_id'],
            'visibility' => $validated['visibility'],
            'are_subtasks_allowed' => $validated['are_subtasks_allowed'],
            'is_task_upvoting_enabled' => $validated['is_task_upvoting_enabled'],
            'are_stats_public' => $validated['are_stats_public'],
            'are_comments_enabled' => $validated['are_comments_enabled'],
            'is_comment_upvoting_allowed' => $validated['is_comment_upvoting_allowed'],
            'are_team_members_visible' => $validated['are_team_members_visible'],
            'is_creator_visible' => $validated['is_creator_visible'],
        ]);

        // Handle file attachments
        if (isset($validated['attachments']) && is_array($validated['attachments']) && count($validated['attachments']) > 0) {
            if (!$user->canUploadAttachments()) {
                abort(403, 'Your plan does not allow file attachments.');
            }
            foreach ($validated['attachments'] as $attachment) {
                $task->addMedia($attachment)->toMediaCollection('attachments');
            }
        }

        if ($validated['has_first_comment']) {
            $comment = $task->comments()->create([
                'author_id' => $request->user()->id,
                'content' => $validated['comment_content'],
                'is_comment_pinned_to_top' => $validated['is_comment_pinned_to_top'],
            ]);

            event(new CommentCreatedEvent([
                'subscribable' => $task,
                'comment' => $comment,
            ]));
        }

        $task->subscribers()->create(['user_id' => $user->id]);

        $assignUsersToTaskAction->handle(
            $task,
            $validated['team_members'] ?? [],
            $task->teamMembers()
        );

        $assignUsersToTaskAction->handle(
            $task,
            $validated['community_members'] ?? [],
            $task->communityMembers()
        );

        return $task->id;
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task,
        AssignUsersToTaskAction $assignUsersToTaskAction,
    ) {
        $validated = $request->validated();

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'task_group_id' => $validated['task_group_id'],
            'task_type_id' => $validated['task_type_id'],
            'task_status_id' => $validated['task_status_id'],
            'visibility' => $validated['visibility'],
            'are_subtasks_allowed' => $validated['are_subtasks_allowed'],
            'are_stats_public' => $validated['are_stats_public'],
            'is_task_upvoting_enabled' => $validated['is_task_upvoting_enabled'],
            'are_comments_enabled' => $validated['are_comments_enabled'],
            'is_comment_upvoting_allowed' => $validated['is_comment_upvoting_allowed'],
            'are_team_members_visible' => $validated['are_team_members_visible'],
            'is_creator_visible' => $validated['is_creator_visible'],
        ]);

        // Handle file attachments
        if (isset($validated['attachments']) && is_array($validated['attachments']) && count($validated['attachments']) > 0) {
            if (!$request->user()->canUploadAttachments()) {
                abort(403, 'Your plan does not allow file attachments.');
            }
            foreach ($validated['attachments'] as $attachment) {
                $task->addMedia($attachment)->toMediaCollection('attachments');
            }
        }

        $assignUsersToTaskAction->handle(
            $task,
            $validated['team_members'] ?? [],
            $task->teamMembers()
        );

        $assignUsersToTaskAction->handle(
            $task,
            $validated['community_members'] ?? [],
            $task->communityMembers()
        );

        return response([
            'message' => 'success',
        ]);
    }

    public function destroy(Task $task)
    {
        $task->delete();
    }
}
