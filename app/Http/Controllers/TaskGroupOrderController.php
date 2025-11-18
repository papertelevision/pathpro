<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\TaskGroup\Models\TaskGroup;
use Illuminate\Http\Request;

class TaskGroupOrderController extends Controller
{
    public function updateBulk(
        Project $project,
        Request $request
    ) {
        if ($request->user()->cannot('updateBulk', [TaskGroup::class, $project])) {
            abort(403);
        }

        foreach ($request->all() as $taskGroup) {
            TaskGroup::findOrFail($taskGroup['id'])->update([
                'order' => $taskGroup['order']
            ]);
        }
    }
}
