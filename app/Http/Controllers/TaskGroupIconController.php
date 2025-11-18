<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\TaskGroup\Actions\UpdateTaskGroupIconAction;
use App\Http\Resources\TaskGroupResource;
use App\Domain\TaskGroup\Actions\AddTaskGroupIconAction;
use App\Domain\TaskGroup\Models\TaskGroup;
use Illuminate\Http\Request;

class TaskGroupIconController extends Controller
{
    public function store(
        Request $request,
        Project $project,
        AddTaskGroupIconAction $addTaskGroupIconAction
    ): TaskGroupResource {
        if ($request->user()->cannot('create', [TaskGroup::class, $project])) {
            abort(403);
        }

        return TaskGroupResource::make($addTaskGroupIconAction->handle($request, TaskGroup::findOrFail($request->task_group_id)));
    }

    public function update(
        Request $request,
        TaskGroup $taskGroup,
        UpdateTaskGroupIconAction $updateTaskGroupIconAction
    ): TaskGroupResource {
        return TaskGroupResource::make($updateTaskGroupIconAction->handle($request, $taskGroup));
    }
}
