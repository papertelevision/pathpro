<?php

namespace Database\Factories;

use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'username' => $this->faker->unique()->userName(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'name' => $this->faker->name(),
            'nickname' => $this->faker->userName(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'biography' => $this->faker->text(),
            'remember_token' => Str::random(10),
            'api_token' => Str::random(60),
            'role' => UserRoleEnum::USER,
        ];
    }

    /**
     * Set role to owner.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function owner()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => UserRoleEnum::SUPER_ADMIN,
            ];
        });
    }

    /**
     * Set role to team member.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function team()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => UserRoleEnum::USER,
            ];
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
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
        return $this->afterCreating(function (User $user) {
            $user
                ->addMedia(resource_path('images/user-default-img.png'))
                ->preservingOriginal()
                ->toMediaCollection('avatar');
        });
    }
}
