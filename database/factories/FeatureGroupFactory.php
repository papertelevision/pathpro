<?php

namespace Database\Factories;

use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\Project\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as Faker;

class FeatureGroupFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FeatureGroup::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => Project::all()->random()->id,
            'title' => 'Feature Voting',
            'header_color' => '#4f6173',
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    // public function configure()
    // {
    //     return $this->afterCreating(function (FeatureGroup $featureGroup) {
    //         $faker = Faker::create();
    //         $imageUrl = $faker->imageUrl(640, 480, null, false);
    //         $featureGroup->addMediaFromUrl($imageUrl)->toMediaCollection('feature-group-icon');
    //     });
    // }
}
