<?php

namespace App\Domain\Task\Actions;

use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Models\TaskGroup;

class GetTaskOrderAction
{
    public function handle(
        TaskGroup $taskGroup,
        ?Task $parentTask = null,
    ) {
        $lastRecord = null;
        if ($parentTask) {
            $lastRecord = $parentTask->children()->get()->last();
        } else {
            $lastRecord = $taskGroup->tasks()->whereNull('parent_task_id')->get()->last();
        }

        return is_null($lastRecord) ? 0 : $lastRecord->order + 1;
    }
}
