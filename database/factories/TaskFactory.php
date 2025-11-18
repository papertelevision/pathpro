<?php

namespace Database\Factories;

use App\Domain\Comment\Models\Comment;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\TaskStatus\Models\TaskStatus;
use App\Domain\TaskType\Models\TaskType;
use App\Domain\Upvote\Models\Upvote;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Task::class;

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
            'task_type_id' => TaskType::all()->random()->id,
            'are_subtasks_allowed' => $this->faker->boolean(),
            // 'project_id' => Project::all()->random()->id,
            'task_group_id' => TaskGroup::all()->random()->id,
            'visibility' => TaskGroupVisibilityEnum::PUBLISHED,
            'task_status_id' => TaskStatus::all()->random()->id,
            'order' => 0,
            'is_task_upvoting_enabled' => $this->faker->boolean(),
            'are_comments_enabled' => $this->faker->boolean(),
            'is_comment_upvoting_allowed' => $this->faker->boolean(),
        ];
    }

    /**
     * Indicate that the task is completed.
     *
     * @return void
     */
    public function completed()
    {
        return $this->state(function () {
            return [
                'task_status_id' => 6,
                'release_note_id' => ReleaseNote::all()->random()->id,
            ];
        });
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Task $task) {
            if ($task->are_comments_enabled) {
                if ($task->is_comment_upvoting_allowed) {
                    Comment::factory(3)->hasUpvotes(rand(0, 10))->create([
                        'commentable_id' => $task->id,
                        'commentable_type' => 'App\\Domain\\Task\\Models\\Task'
                    ]);
                } else {
                    Comment::factory(3)->create([
                        'commentable_id' => $task->id,
                        'commentable_type' => 'App\\Domain\\Task\\Models\\Task'
                    ]);
                }
            }

            if ($task->is_task_upvoting_enabled) {
                Upvote::factory(3)->create([
                    'upvotable_id' => $task->id,
                    'upvotable_type' => 'App\\Domain\\Task\\Models\\Task'
                ]);
            }
        });
    }
}
