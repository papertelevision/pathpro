<?php

namespace App\Domain\User\Actions;

use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;

class CheckPageWhiteLabelingAction
{
    public function handle(
        ?Project $project = null
    ) {
        /** @var User */
        $user = auth()->check() ? auth()->user() : null;

        if ($project) {
            $creator = $project->creator_id === $user?->id ? $user : $project->creator;

            if ($creator->isSuperAdmin()) {
                return true;
            }

            $plan = $creator->plan;
            if ($plan) {
                return $plan->isWhiteLabeled();
            }

            return false;
        }

        if ($user) {
            if ($user->isSuperAdmin()) {
                return true;
            }

            $plan = $user->plan;
            if ($plan) {
                return $plan->isWhiteLabeled();
            }
        }

        return false;
    }
}
