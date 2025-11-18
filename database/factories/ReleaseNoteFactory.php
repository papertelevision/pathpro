<?php

namespace Database\Factories;

use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReleaseNoteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ReleaseNote::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'author_id' => User::all()->random()->id,
            'project_id' => Project::all()->random()->id,
            'title' => $this->faker->word(),
            'description' => $this->faker->text(),
            'status' => $this->faker->randomElement(['Published', 'Draft']),
            'deleted_at' => $this->faker->randomElement([$this->faker->dateTime(), NULL])
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (ReleaseNote $releaseNote) {
            if ($releaseNote->id % 2 == 0) { // to reduce completed tasks
                Task::factory(1)->create([
                    'task_status_id' => 6,
                    'release_note_id' => $releaseNote->id,
                    'project_id' => $releaseNote->project_id,
                    'task_group_id' => TaskGroup::where(['project_id' => $releaseNote->project_id])->get()->random()->id,
                ]);
            }

            if (!is_null($releaseNote->deleted_at)) {
                $releaseNote->update(['status' => 'Deleted']);
            }
        });
    }
}
