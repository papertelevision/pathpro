<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\Project\Enums\ProjectVisibilityEnum;
use App\Domain\TaskGroup\Enums\TaskGroupVisibilityEnum;
use App\Http\Resources\EnumResource;

class VisibilityController extends Controller
{
    public function index()
    {
        return [
            'projectVisibilities' =>
            EnumResource::collection(
                ProjectVisibilityEnum::valuesWithLabels()
            ),
            'featureVisibilities' =>
            EnumResource::collection(
                FeatureVisibilityEnum::valuesWithLabels()
            ),
            'taskGroupVisibilities' =>
            EnumResource::collection(
                TaskGroupVisibilityEnum::valuesWithLabels()
            )
        ];
    }
}
