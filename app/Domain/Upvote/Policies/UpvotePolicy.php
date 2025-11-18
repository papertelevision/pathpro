<?php

namespace App\Domain\Upvote\Policies;

use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;

class UpvotePolicy
{
    public function create(
        ?User $user,
        Project $project
    ) {
        return true;
    }

    public function delete(
        ?User $user,
        Project $project
    ) {
        return true;
    }
}
