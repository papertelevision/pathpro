<?php

namespace Database\Factories;

use App\Domain\News\Models\News;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class NewsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = News::class;

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
            'title' => sprintf('Sample News #%s', Str::random(5)),
            'description' => $this->faker->text(),
            'status' => $this->faker->randomElement(['archived', 'draft']),
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
        return $this->afterCreating(function (News $news) {
            $projects = Project::all();

            foreach ($projects as $project) {
                $lastNewsUpdate =
                    News::where('project_id', $project->id)
                    ->where('deleted_at', NULL)
                    ->orderByDesc("id")
                    ->first();

                if (!is_null($lastNewsUpdate)) {
                    $lastNewsUpdate->fill(['status' => 'live']);
                    $lastNewsUpdate->save();
                }
            }

            if (!is_null($news->deleted_at)) {
                $news->update(['status' => 'deleted']);
            }
        });
    }
}
