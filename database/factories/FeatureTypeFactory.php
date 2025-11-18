<?php

namespace Database\Factories;

use App\Domain\FeatureType\Models\FeatureType;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeatureTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FeatureType::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'color' => $this->faker->hexColor(),
            'title' => $this->faker->word(),
            'label' => $this->faker->word()
        ];
    }
}
