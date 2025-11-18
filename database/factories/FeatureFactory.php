<?php

namespace Database\Factories;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\Feature\Models\Feature;
use App\Domain\FeatureType\Models\FeatureType;
use App\Domain\Project\Models\Project;
use App\Domain\Upvote\Models\Upvote;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeatureFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Feature::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->word(),
            'description' => $this->faker->text(),
            'feature_type_id' => FeatureType::all()->random()->id,
            'is_task_confirmed' => $this->faker->boolean(),
            'project_id' => Project::all()->random()->id,
            'visibility' => FeatureVisibilityEnum::PUBLIC
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Feature $feature) {
            Comment::factory(3)->hasUpvotes(rand(0, 10))->create([
                'commentable_id' => $feature->id,
                'commentable_type' => 'App\\Domain\\Feature\\Models\\Feature'
            ]);

            Upvote::factory(random_int(1, 10))->create([
                'upvotable_id' => $feature->id,
                'upvotable_type' => 'App\\Domain\\Feature\\Models\\Feature'
            ]);
        });
    }
}
