<?php

namespace App\Http\Controllers;

use App\Domain\Submission\Enums\SubmissionStatusEnum;
use App\Http\Resources\EnumResource;

class SubmissionStatusController extends Controller
{
    public function index()
    {
        $filteredValues = collect(SubmissionStatusEnum::valuesWithLabels())->reject(
            fn ($value) => $value['value'] === SubmissionStatusEnum::DELETED->value
        );

        $filteredValues[] = [
            'id' => 'noStatusApplied',
            'value' => 'noStatusApplied',
            'label' => 'No Status Applied',
        ];

        return EnumResource::collection($filteredValues);
    }
}
