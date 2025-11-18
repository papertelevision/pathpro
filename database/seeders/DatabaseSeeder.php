<?php

namespace Database\Seeders;

use App\Domain\FeatureType\Models\FeatureType;
use App\Domain\TaskType\Models\TaskType;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->seedTaskStatuses();
        $this->seedTaskTypes();
        $this->seedFeatureTypes();

        $this->call(ProjectSeeder::class);
    }

    /**
     * Seed Task Statuses.
     *
     * @return void
     */
    protected function seedTaskStatuses(): void
    {
        $this->call(TaskStatusSeeder::class);
    }

    /**
     * Seed Task Types.
     *
     * @return void
     */
    protected function seedTaskTypes(): void
    {
        $taskTypes = require __DIR__ . '/data/task-types.php';

        TaskType::factory()
            ->count(count($taskTypes))
            ->sequence(fn ($sequence) => [
                'title' => $taskTypes[$sequence->index]['title'],
                'color' => $taskTypes[$sequence->index]['color'],
            ])
            ->create();
    }

    /**
     * Seed Feature Types.
     *
     * @return void
     */
    protected function seedFeatureTypes(): void
    {
        $featureTypes = require __DIR__ . '/data/feature-types.php';

        FeatureType::factory()
            ->count(count($featureTypes))
            ->sequence(fn ($sequence) => [
                'title' => $featureTypes[$sequence->index]['title'],
                'color' => $featureTypes[$sequence->index]['color'],
            ])
            ->create();
    }
}
