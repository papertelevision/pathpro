<?php

namespace App\Domain\ReleaseNote\Actions;

use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Task\Models\Task;

class UpdateReleaseNoteTasksAction
{
    /**
     * Add Completed Tasks to Release Note.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Domain\ReleaseNote\Models\ReleaseNote $releaseNote
     * @return void
     */
    public function handle($request, ReleaseNote $releaseNote)
    {
        Task::where('release_note_id', $releaseNote->id)->each(function ($task) {
            $task->fill([
                'release_note_id' => NULL
            ])->save();
        });

        foreach ($request->tasks as $task) {
            Task::find($task['id'])->fill([
                'release_note_id' => $releaseNote->id
            ])->save();
        }
    }
}
