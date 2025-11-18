<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\TaskGroup\Actions\GetTaskGroupPositionAction;
use App\Domain\TaskGroup\Enums\TaskGroupPlannedReleaseTypeEnum;
use App\Http\Domain\TaskGroup\Requests\StoreTaskGroupRequest;
use App\Http\Domain\TaskGroup\Requests\UpdateTaskGroupRequest;
use App\Http\Resources\TaskGroupResource;
use Carbon\Carbon;

class TaskGroupController extends Controller
{
    public function store(
        StoreTaskGroupRequest $request,
        Project $project,
        GetTaskGroupPositionAction $getTaskGroupPositionAction,
    ) {
        if ($request->user()->cannot('create', [TaskGroup::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        $validated['planned_release_start_date'] = Carbon::parse($validated['planned_release_start_date'])->format('Y-m-d H:i:s');
        $validated['planned_release_end_date'] = Carbon::parse($validated['planned_release_end_date'])->format('Y-m-d H:i:s');
        $validated['order'] = $getTaskGroupPositionAction->handle($project);

        if ($validated['planned_release_type'] === TaskGroupPlannedReleaseTypeEnum::singleDate()->label) {
            $validated['planned_release_type'] = TaskGroupPlannedReleaseTypeEnum::singleDate();
            $validated['planned_release_end_date'] = $validated['planned_release_start_date'];
        } else {
            $validated['planned_release_type'] = TaskGroupPlannedReleaseTypeEnum::dateRange();
        }

        $taskGroup = $project->taskGroups()->create($validated);

        return TaskGroupResource::make($taskGroup);
    }

    public function update(
        UpdateTaskGroupRequest $request,
        TaskGroup $taskGroup,
    ) {
        $validated = $request->validated();

        $validated['planned_release_start_date'] = Carbon::parse($validated['planned_release_start_date'])->format('Y-m-d H:i:s');
        $validated['planned_release_end_date'] = Carbon::parse($validated['planned_release_end_date'])->format('Y-m-d H:i:s');

        if ($validated['planned_release_type'] === TaskGroupPlannedReleaseTypeEnum::singleDate()->label) {
            $validated['planned_release_type'] = TaskGroupPlannedReleaseTypeEnum::singleDate();
            $validated['planned_release_end_date'] = $validated['planned_release_start_date'];
        } else {
            $validated['planned_release_type'] = TaskGroupPlannedReleaseTypeEnum::dateRange();
        }

        // If switching to predefined icon, clear any uploaded icon media
        if (isset($validated['icon_type']) && $validated['icon_type'] === 'predefined') {
            $taskGroup->clearMediaCollection('icon');
        }

        $taskGroup->update($validated);

        return TaskGroupResource::make($taskGroup->refresh());
    }

    public function destroy(
        TaskGroup $taskGroup
    ) {
        $nextTaskGroups = TaskGroup::where('order', '>', $taskGroup->order)->get();

        if ($nextTaskGroups) {
            foreach ($nextTaskGroups as $nextTaskGroup) {
                $nextTaskGroup->decrement('order');
            }
        }

        $taskGroup->delete();
    }
}
