<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\FeatureType\Models\FeatureType;
use App\Domain\Task\Enums\TaskStatusEnum;
use App\Domain\Project\Models\Project;
use App\Domain\Submission\Enums\SubmissionStatusEnum;
use App\Domain\Submission\Models\Submission;
use App\Domain\Task\Actions\GetTaskOrderAction;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\TaskStatus\Models\TaskStatus;
use App\Domain\TaskType\Models\TaskType;
use App\Http\Domain\Submission\Requests\StoreAdoptedSubmissionRequest;

class AdoptedSubmissionController extends Controller
{
    public function store(
        StoreAdoptedSubmissionRequest $request,
        Project $project,
        Submission $submission,
        GetTaskOrderAction $getTaskOrderAction
    ) {
        if ($request->user()->cannot('adopt', [Submission::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        if ($validated['adopt_to'] === SubmissionStatusEnum::ROADMAP->value) {
            $taskGroup = TaskGroup::find($validated['task_group_id']);
            $taskType = TaskType::where('title', 'New Feature(s)')->first();
            $taskStatus = TaskStatus::where('title', TaskStatusEnum::DEVELOPMENT->label())->first();

            $taskGroup->tasks()->create([
                'order' => $getTaskOrderAction->handle(TaskGroup::find($validated['task_group_id'])),
                'title' => $submission->title,
                'description' => $submission->description,
                'project_id' => $project->id,
                'task_type_id' => $taskType->id,
                'task_status_id' => $taskStatus->id,
                'visibility' => TaskGroupVisibilityEnum::PUBLISHED,
                'are_subtasks_allowed' => false,
                'is_task_upvoting_enabled' => false,
                'are_comments_enabled' => false,
                'is_comment_upvoting_allowed' => false,
            ]);

            $submission->update(['status' => SubmissionStatusEnum::ROADMAP]);
        }

        if ($validated['adopt_to'] === SubmissionStatusEnum::VOTING->value) {
            $featureType = FeatureType::where('title', 'Entirely New Feature')->first();

            $project->features()->create([
                'title' => $submission->title,
                'description' => $submission->description,
                'feature_type_id' => $featureType->id,
                'feature_group_id' => $project->featureGroup->id,
                'visibility' => FeatureVisibilityEnum::PUBLIC,
                'is_task_confirmed' => false,
            ]);

            $submission->update(['status' => SubmissionStatusEnum::VOTING]);
        }

        return response([
            'message' => 'success',
        ]);
    }
}
