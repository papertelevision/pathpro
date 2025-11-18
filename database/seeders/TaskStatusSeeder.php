<?php

namespace Database\Seeders;

use App\Domain\Task\Enums\TaskStatusEnum;
use App\Domain\TaskStatus\Models\TaskStatus;
use Illuminate\Database\Seeder;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $currentStatuses = TaskStatus::all()->pluck('title')->toArray();
        $newStatuses = array_values(array_diff(TaskStatusEnum::labels(), $currentStatuses));

        TaskStatus::factory()
            ->count(count($newStatuses))
            ->sequence(fn ($sequence) => ['title' => $newStatuses[$sequence->index]])
            ->create();
    }
}
