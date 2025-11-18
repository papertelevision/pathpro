<?php

namespace Database\Factories;

use App\Domain\Upvote\Models\Upvote;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UpvoteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Upvote::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'author_id' => User::all()->random()->id,
        ];
    }
}
