<?php

namespace App\Domain\Task\Actions;

use App\Domain\Task\Models\Task;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class AssignUsersToTaskAction
{
    public function handle(
        Task $task,
        array $membersIds,
        BelongsToMany $membersQuery,
    ) {
        $membersCollectionIds = (clone $membersQuery)->select('users.id')->get()->pluck('id')->toArray();

        $noLongerMembers = collect($membersCollectionIds)->diff($membersIds)->all();
        $newMembers = collect($membersIds)->diff($membersCollectionIds)->all();

        foreach ($noLongerMembers as $id) {
            $task->subscribers()->where('user_id', $id)->delete();
        }

        foreach ($newMembers as $id) {
            $task->subscribers()->create(['user_id' => $id]);
        }

        $membersQuery->sync($membersIds);
    }
}
