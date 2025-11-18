<?php

namespace App\Domain\FeatureGroup\Actions;

use App\Domain\FeatureGroup\Models\FeatureGroup;
use App\Domain\FeatureType\Models\FeatureType;
use Illuminate\Support\Facades\DB;

class CreateFeaturesFilterValues
{
    protected function addTypeValue(
        FeatureType $type
    ) {
        return [
            'id' => $type->id,
            'title' => $type->title,
            'label' => $type->label,
            'color' => $type->color
        ];
    }

    public function handle(
        FeatureGroup $group
    ) {
        $features = $group->features;

        $filterValues = [];

        if ($features->count() > 0) {
            $filterValues[] = [
                'id' => 'suggested-by-us',
                'label' => 'Suggested By Us',
                'icon' => asset('images/staff_sug.png')
            ];
        }

        if (DB::table('feature_user')->whereIn('feature_id', $features->pluck('id')->toArray())->count() > 0) {
            $filterValues[] = [
                'id' => 'community-suggested',
                'label' => 'Community Suggested',
                'icon' => asset('images/community.png')
            ];
        }

        if ($features->contains(fn ($feature) => $feature->is_task_confirmed === true)) {
            $filterValues[] = [
                'id' => 'confirmed',
                'label' => 'Confirmed',
                'icon' => asset('images/confirmed.png')
            ];
        }

        $newFeature = FeatureType::where('title', 'Entirely New Feature')->first();
        if ($features->contains(fn ($feature) => $feature->feature_type_id === $newFeature->id)) {
            $filterValues[] = $this->addTypeValue($newFeature);
        }

        $revision = FeatureType::where('title', 'Tweak/Revision to Existing Feature')->first();
        if ($features->contains(fn ($feature) => $feature->feature_type_id === $revision->id)) {
            $filterValues[] = $this->addTypeValue($revision);
        }

        $discursion = FeatureType::where('title', 'Up For Discussion')->first();
        if ($features->contains(fn ($feature) => $feature->feature_type_id === $discursion->id)) {
            $filterValues[] = $this->addTypeValue($discursion);
        }

        $other = FeatureType::where('title', 'Other/Misc')->first();
        if ($features->contains(fn ($feature) => $feature->feature_type_id === $other->id)) {
            $filterValues[] = $this->addTypeValue($other);
        }

        return $filterValues;
    }
}
