<?php

namespace Database\Factories;

use App\Domain\Comment\Models\Comment;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'content' => $this->faker->text(),
            'is_comment_pinned_to_top' => $this->faker->boolean(),
            'is_comment_highlighted' => $this->faker->boolean(),
            'author_id' => User::all()->random()->id,
            'parent_comment_id' => null,
        ];
    }
}
