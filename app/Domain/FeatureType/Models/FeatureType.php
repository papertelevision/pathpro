<?php

namespace App\Domain\FeatureType\Models;

use App\Domain\Feature\Models\Feature;
use Database\Factories\FeatureTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureType extends Model
{
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return FeatureTypeFactory::new();
    }

    /**
     * Get all of the features for the feature type.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function features()
    {
        return $this->hasMany(Feature::class);
    }
}
