<?php

namespace App\Http\Controllers;

use App\Domain\Task\Models\Task;
use Illuminate\Http\Request;

class TaskSubtaskOrderController extends Controller
{
    /**
     * Update tasks subtasks order.
     *
     * @param Illuminate\Http\Request $request
     * @return void
     */
    public function updateBulk(Request $request)
    {
        foreach ($request->all() as $subtask) {
            Task::findOrFail($subtask['id'])->update([
                'order' => $subtask['order']
            ]);
        }
    }
}
