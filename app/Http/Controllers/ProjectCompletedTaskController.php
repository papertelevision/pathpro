<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;

class ProjectCompletedTaskController extends Controller
{
    /**
     * Get all of the completed tasks for the project.
     * @param  \App\Domain\Project\Models\Project $project
     * @return void
     */
    public function show(Project $project)
    {
        $tasks = Task::completed()->where('project_id', $project->id)->all();

        return TaskResource::collection($tasks);
    }
}
