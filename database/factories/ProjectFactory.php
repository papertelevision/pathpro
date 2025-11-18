<?php

namespace Database\Factories;

use App\Domain\Project\Enums\ProjectVisibilityEnum;
use App\Domain\Project\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => sprintf('Sample Project #%s', Str::random(5)),
            'description' => $this->faker->text(),
            'visibility' => ProjectVisibilityEnum::PUBLIC,
            'is_description_public' => $this->faker->boolean(),
            'is_public_upvoting_allowed' => $this->faker->boolean(),
            'are_feature_submissions_allowed' => $this->faker->boolean(),
            'are_non_subscribers_allowed_to_subscribe_to_updates' => $this->faker->boolean(),
            'are_non_subscribers_allowed_to_share_on_social_media' => $this->faker->boolean(),
        ];
    }
}
