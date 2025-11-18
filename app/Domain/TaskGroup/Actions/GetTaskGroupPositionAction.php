<?php

namespace App\Domain\TaskGroup\Actions;

use App\Domain\Project\Models\Project;

class GetTaskGroupPositionAction
{
    public function handle(
        Project $project,
    ) {
        $lastRecord = $project->taskGroups->last();

        return is_null($lastRecord) ? 0 : $lastRecord->order + 1;
    }
}
