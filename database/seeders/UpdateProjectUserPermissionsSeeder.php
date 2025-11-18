<?php

namespace Database\Seeders;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Models\ProjectUser;
use App\Domain\User\Models\User;
use Illuminate\Database\Seeder;

class UpdateProjectUserPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (ProjectUser::teamMembers()->get() as $permission) {
            $member = User::withTrashed()->find($permission->user_id);

            $member?->permissions()->updateExistingPivot($permission->project_id, [
                'permission' => ProjectUserPermissionEnum::values()
            ]);
        }
    }
}
