<?php

namespace App\Console\Commands;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\Plan\Models\PlanUser;
use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateFreePlanTestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-free-plan-test-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a free plan and a test user with that plan for testing purposes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating free plan and test user...');

        // Create or find free plan
        $plan = Plan::firstOrCreate(
            ['slug' => 'free-plan'],
            [
                'name' => 'Free Plan',
                'description' => '<p>Free tier plan for testing - limited features</p>',
                'provider' => PlanProviderEnum::STRIPE,
                'provider_payload' => null,
                'price' => 0,
                'yearly_discount_percentage' => 0,
                'projects_count' => 1,
                'team_members_count' => 0,
                'community_members_count' => 10,
                'tech_support_type' => null,
                'is_recommended' => false,
                'is_white_labeled' => false,
                'are_private_projects_allowed' => false,
                'are_file_attachments_allowed' => false,
                'features' => [
                    ['feature' => '<p>1 project</p>'],
                    ['feature' => '<p>Up to 10 community members</p>'],
                    ['feature' => '<p>No team members</p>'],
                    ['feature' => '<p>No file attachments</p>'],
                ],
            ]
        );

        $this->info("Free plan created/found: {$plan->name} (ID: {$plan->id})");

        // Check if user already exists
        $existingUser = User::where('email', 'freeuser@example.com')->first();

        if ($existingUser) {
            $user = $existingUser;
            $this->info("Test user already exists: {$user->email} (ID: {$user->id})");

            // Assign plan to user if not already assigned
            if (!$user->plan) {
                PlanUser::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'type' => PlanTypeEnum::SUBSCRIPTION,
                    'provider_payload' => null,
                ]);
                $this->info('Plan assigned to user');
            } else {
                $this->info('User already has a plan assigned');
            }
        } else {
            // Create new user with project using factory
            $user = User::factory()->has(Project::factory(1))->create([
                'username' => 'freeuser',
                'name' => 'Free Plan Test User',
                'nickname' => 'freeuser',
                'email' => 'freeuser@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRoleEnum::USER,
            ]);

            $this->info("Test user created: {$user->email} (ID: {$user->id})");

            // Assign plan to user
            PlanUser::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'type' => PlanTypeEnum::SUBSCRIPTION,
                'provider_payload' => null,
            ]);
            $this->info('Plan assigned to user');

            $project = $user->projects->first();
            $this->info("Test project created: {$project->title} (ID: {$project->id})");
        }

        $this->newLine();
        $this->info('✅ Setup complete!');
        $this->newLine();
        $this->line('Login credentials:');
        $this->line('  Email: freeuser@example.com');
        $this->line('  Password: password');
        $this->newLine();
        $this->line('Plan details:');
        $this->line("  Name: {$plan->name}");
        $this->line('  Price: $0 (Free)');
        $this->line('  Projects allowed: 1');
        $this->line('  Team members: 0');
        $this->line('  File attachments: Disabled');

        return 0;
    }
}
