<?php

namespace App\Domain\FeatureGroup\Models;

use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use Database\Factories\FeatureGroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class FeatureGroup extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = ['icon', 'icon_type', 'icon_identifier'];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return FeatureGroupFactory::new();
    }

    /**
     * The project that the feature group belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get all of the features for the feature group.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\HasMany
     */
    public function features()
    {
        return $this->hasMany(Feature::class);
    }
}
