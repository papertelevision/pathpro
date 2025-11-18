<?php

namespace App\Domain\FeatureGroup\Policies;

use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\User\Models\User;

class FeatureGroupPolicy
{
    public function update(
        User $user,
        FeatureGroup $featureGroup
    ) {
        $project = $featureGroup->project;

        return $user->assignedAsAdminToProjects->contains($project) ||
            $project->creator_id === $user->id;
    }
}
