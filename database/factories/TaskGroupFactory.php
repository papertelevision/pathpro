<?php

namespace Database\Factories;

use App\Domain\TaskGroup\Enums\TaskGroupPlannedReleaseTypeEnum;
use App\Domain\Project\Models\Project;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\TaskGroup\Models\TaskGroup;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TaskGroupFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TaskGroup::class;

    private static $order = 0;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order' => 0,
            'project_id' => Project::all()->random()->id,
            'title' => sprintf('Task Group #%s', Str::random(5)),
            'header_color' => $this->faker->hexColor(),
            'visibility' => TaskGroupVisibilityEnum::PUBLISHED,
            'is_percentage_complete_visible' => $this->faker->boolean(),
        ];
    }

    /**
     * Set planned release type to task group.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function plannedReleaseType()
    {
        return $this->state(function () {
            $startDate = null;
            $endDate = null;

            $type = $this->faker->randomElement([TaskGroupPlannedReleaseTypeEnum::singleDate(), TaskGroupPlannedReleaseTypeEnum::dateRange()]);

            if ($type->equals(TaskGroupPlannedReleaseTypeEnum::dateRange())) {
                $startDate = $this->faker->dateTimeBetween('now');
                $endDate = $this->faker->dateTimeBetween('now', '+7 days');
            }

            if ($type->equals(TaskGroupPlannedReleaseTypeEnum::singleDate())) {
                $startDate = Carbon::now()->startOfDay();
                $endDate = Carbon::now()->endOfDay();
            }

            return [
                'planned_release_type' => $type,
                'planned_release_start_date' => $startDate,
                'planned_release_end_date' => $endDate,
            ];
        });
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    // public function configure()
    // {
    //     return $this->afterCreating(function (TaskGroup $taskGroup) {
    //         $faker = Faker::create();
    //         $imageUrl = $faker->imageUrl(640, 480, null, false);
    //         $taskGroup->addMediaFromUrl($imageUrl)->toMediaCollection('icon');
    //     });
    // }
}
