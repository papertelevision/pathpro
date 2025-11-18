<?php

namespace App\Http\Controllers;

use App\Domain\FeatureGroup\Actions\CreateFeaturesFilterValues;
use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Http\Domain\FeatureGroup\Requests\UpdateFeatureGroupRequest;
use App\Http\Resources\FeatureGroupResource;
use App\Domain\Project\Models\Project;

class ProjectFeatureGroupController extends Controller
{
    public function show(
        Project $project,
        CreateFeaturesFilterValues $createFeaturesFilterValues
    ) {
        $group = $project->featureGroup;

        return FeatureGroupResource::make($project->featureGroup)
            ->additional(['filterValues' => $createFeaturesFilterValues->handle($group)]);
    }

    public function update(
        UpdateFeatureGroupRequest $request,
        FeatureGroup $featureGroup,
    ) {
        $validated = $request->validated();

        // If switching to predefined icon, clear any uploaded icon media
        if (isset($validated['icon_type']) && $validated['icon_type'] === 'predefined') {
            $featureGroup->clearMediaCollection('feature-group-icon');
        }

        $featureGroup->update($validated);

        if (
            $request->hasFile('icon') &&
            $request->file('icon')->isValid()
        ) {
            $featureGroup->clearMediaCollection('feature-group-icon');
            $featureGroup->addMediaFromRequest('icon')->toMediaCollection('feature-group-icon');
        }

        return response(['message' => 'success']);
    }
}
