<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use Illuminate\Http\Request;

class TaskOrderController extends Controller
{
    public function updateBulk(
        Request $request,
        Project $project
    ) {
        if ($request->user()->cannot('updateBulk', [Task::class, $project])) {
            abort(403);
        }

        collect($request->all())->each(function ($items) {
            foreach ($items as $item) {
                $task = Task::find($item['id']);

                $task->update([
                    'task_group_id' => $item['task_group_id'],
                    'order' => $item['order'],
                ]);

                foreach ($task->children as $subtask) {
                    $subtask->update([
                        'task_group_id' => $item['task_group_id']
                    ]);
                }
            }
        });
    }
}
