<?php

namespace Database\Factories;

use App\Domain\Project\Models\Project;
use App\Domain\Submission\Enums\SubmissionStatusEnum;
use App\Domain\Submission\Models\Submission;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Submission::class;

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
            'status' => $this->faker->randomElement([SubmissionStatusEnum::HIGHLIGHTED, SubmissionStatusEnum::DENIED, NULL]),
            'deleted_at' => $this->faker->randomElement([NULL, $this->faker->dateTime()])
        ];
    }


    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Submission $submission) {
            $projects = Project::all();

            foreach ($projects as $project) {
                $lasSubmission = Submission::where("project_id", $project->id)
                    ->orderByDesc("id")
                    ->first();

                if (!is_null($lasSubmission)) {
                    $lasSubmission->fill(['status' => SubmissionStatusEnum::NEW]);
                    $lasSubmission->save();
                }
            }

            if ($submission->status == 'Highlighted') {
                $submission->update(['is_highlighted' => 1]);
            }

            if (!is_null($submission->deleted_at)) {
                $submission->update(['status' => SubmissionStatusEnum::DELETED]);
            }
        });
    }
}
