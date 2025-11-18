<?php

namespace Database\Seeders;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Models\Feature;
use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\News\Models\News;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\User\Models\User;
use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Submission\Models\Submission;
use App\Domain\Task\Models\Task;
use App\Domain\TaskGroup\Models\TaskGroup;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Enums\UserRoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RyanChandler\FilamentNavigation\Models\Navigation;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Navigation::create([
            'name' => 'Help Menu',
            'handle' => 'help-menu',
            'items' =>  [
                "17a49bd5-47a8-435b-8dd1-a1e8002a66fd" => [
                    "label" => "Knowledge Base",
                    "type" => "knowledge-base-link",
                    "data" => [
                        "url" => "https://www.example.com/",
                        "is_tour_option" => false
                    ],
                    "children" => []
                ],
                "25e6d6fa-a4d9-4cec-8433-7eb9f4b4e05a" => [
                    "label" => "Contact Support",
                    "type" => "support-link",
                    "data" => [
                        "url" => "https://www.example.com/",
                        "is_tour_option" => false
                    ],
                    "children" => []
                ],
                "6cc802cc-d9d8-4208-bf56-cab145b58dbf" => [
                    "label" => "Feature Tour",
                    "data" => [
                        "is_tour_option" => true
                    ],
                    "type" => null,
                    "children" => []
                ]
            ]
        ]);

        $admin = User::factory()->owner()->has(Project::factory(1))->create([
            'username' => 'admin',
            'name' => 'admin',
            'nickname' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => UserRoleEnum::SUPER_ADMIN,
        ]);

        $admin->projects->each(function ($project) use ($admin) {
            $users = User::factory(3)->team()->create();

            $teamMembersPermissions = json_encode(ProjectUserPermissionEnum::values());

            foreach ($users as $user) {
                DB::table('project_user')->insert([
                    'project_id' => $project->id,
                    'user_id' => $user->id,
                    'permission' => $teamMembersPermissions,
                    'role' => ProjectUserRoleEnum::teamMember,
                    'is_joined' => true,
                ]);
            }

            DB::table('project_user')->insert([
                'project_id' => $project->id,
                'user_id' => $admin->id,
                'permission' => json_encode(['*']),
                'role' => ProjectUserRoleEnum::admin
            ]);

            $communityMembers = User::factory(3)->create();

            foreach ($communityMembers as $communityMember) {
                DB::table('project_user')->insert([
                    'project_id' => $project->id,
                    'user_id' => $communityMember->id,
                    'permission' => $teamMembersPermissions,
                    'role' => ProjectUserRoleEnum::communityMember,
                    'rank' => UserRankEnum::COMMUNITY_MEMBER,
                    'is_joined' => true,
                ]);

                Submission::factory(1)->create([
                    'author_id' => $communityMember->id,
                ]);
            }

            TaskGroup::factory()
                ->count(3)
                ->plannedReleaseType()
                ->create([
                    'project_id' => $project->id
                ])
                ->each(function ($taskGroup) {
                    Task::factory(3)->create([
                        'task_group_id' => $taskGroup->id,
                        'project_id' => $taskGroup->project_id
                    ]);
                });

            FeatureGroup::factory(1)
                ->create([
                    'project_id' => $project->id,
                ])
                ->each(function ($featureGroup) {
                    $featureTitles = [
                        'Webhooks',
                        'New Payment Gateways',
                        'Translation Support',
                        'Form Embedding',
                        'More Color Options',
                        'Design Refinements'
                    ];

                    foreach ($featureTitles as $title) {
                        Feature::factory(50)->create([
                            'title' => $title,
                            'feature_group_id' => $featureGroup->id,
                            'project_id' => $featureGroup->project_id,
                        ]);
                    }
                });

            $taskGroups = TaskGroup::where('project_id', '=', $project->id)->get();

            $order = 0;
            foreach ($taskGroups as $taskGroup) {
                $taskGroup->increment('order', $order);
                ++$order;
            }
        });

        ReleaseNote::factory(5)->create();
        News::factory(5)->create();

        TaskGroup::all()->each(function ($taskGroup) {
            $tasks = Task::where('task_group_id', '=', $taskGroup->id)->get();

            $order = 0;
            foreach ($tasks as $task) {
                $task->increment('order', $order);
                ++$order;
            }
        });

        // Subtasks
        for ($i = 0; $i < 10; $i++) {
            $parentTask = Task::where('are_subtasks_allowed', 1)->get()->random();

            Task::factory(2)->create([
                'are_subtasks_allowed' => 0,
                'project_id' => $parentTask->project_id,
                'task_group_id' => $parentTask->task_group_id,
                'parent_task_id' => $parentTask->id,
            ]);
        }

        // Subtasks ordering
        Task::all()->each(function ($task) {
            $subTasks = Task::where('parent_task_id', $task->id)->get();

            $order = 0;
            foreach ($subTasks as $subtask) {
                $subtask->increment('order', $order);
                ++$order;
            }
        });

        // Replies for tasks and features comments
        for ($i = 0; $i < 20; $i++) {
            $parentComment = Comment::all()->random();

            Comment::factory(1)->create([
                'parent_comment_id' => $parentComment->id,
                'commentable_id'  => $parentComment->commentable_id,
                'commentable_type' => $parentComment->commentable_type,
            ]);
        }
    }
}
