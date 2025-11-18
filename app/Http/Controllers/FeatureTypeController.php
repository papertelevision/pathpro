<?php

namespace App\Http\Controllers;

use App\Http\Resources\FeatureTypeResource;
use App\Domain\FeatureType\Models\FeatureType;

class FeatureTypeController extends Controller
{
    /**
     * Get all of the feature types.
     *
     * @return void
     */
    public function index()
    {
        $featureTypes = FeatureType::all();

        return FeatureTypeResource::collection($featureTypes);
    }

    /**
     * Get the feature type given by feature id.
     *
     * @param \App\Domain\FeatureType\Models\FeatureType $featureType
     * @return void
     */
    public function show(FeatureType $featureType)
    {
        return new FeatureTypeResource($featureType);
    }
}
