<?php

namespace App\Domain\FeatureGroup\Actions;

use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\Project\Models\Project;

class CreateFeatureGroupAction
{
    /**
     * Create a new Feature Group.
     *
     * @param  \App\Domain\Project\Models\Project  $project
     * @return \App\Domain\FeatureGroup\Models\FeatureGroup
     */
    public function handle(Project $project)
    {
        $featureGroup = FeatureGroup::create([
            'title' => 'Feature Voting',
            'header_color' => '#4f6173',
            'project_id' => $project->id,
        ]);

        $defaultFeatureGroupIconUrl = resource_path('images/task_voting.svg');

        $featureGroup
            ->addMedia($defaultFeatureGroupIconUrl)
            ->preservingOriginal()
            ->toMediaCollection('feature-group-icon');
    }
}
