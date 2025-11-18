<?php

namespace Database\Seeders;

use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRankEnum;
use Illuminate\Database\Seeder;

class UpdateCommunityMembersRankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::withTrashed()->get();

        foreach ($projects as $project) {
            foreach ($project->communityMembers()->withPivot('rank')->get() as $member) {
                if (is_null($member->pivot->rank)) {
                    $member->permissions()->updateExistingPivot($project->id, [
                        'rank' => UserRankEnum::COMMUNITY_MEMBER
                    ]);
                }
            }
        }
    }
}
