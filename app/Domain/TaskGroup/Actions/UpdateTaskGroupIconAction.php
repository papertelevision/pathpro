<?php

namespace App\Domain\TaskGroup\Actions;

use App\Domain\TaskGroup\Models\TaskGroup;

class UpdateTaskGroupIconAction
{
    /**
     * Update icon of Task Group.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Domain\TaskGroup\Models\TaskGroup  $taskGroup
     * @return \App\Domain\TaskGroup\Models\TaskGroup  $taskGroup
     */
    public function handle($request, TaskGroup $taskGroup)
    {
        if ($request->hasFile('icon') && $request->file('icon')->isValid()) {
            $taskGroup->clearMediaCollection('icon');
            $taskGroup->addMediaFromRequest('icon')->toMediaCollection('icon');
        }

        return $taskGroup->refresh();
    }
}
