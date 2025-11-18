<?php

namespace Database\Factories;

use App\Domain\TaskType\Models\TaskType;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TaskType::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'color' => $this->faker->hexColor(),
            'title' => $this->faker->word()
        ];
    }
}
