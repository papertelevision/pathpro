<?php

namespace App\Domain\Plan\Models;

use App\Domain\Plan\Enums\PlanProviderEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Plan extends Model
{
    use HasSlug;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'provider' => PlanProviderEnum::class,
        'features' => 'array',
        'provider_payload' => 'array',
        'is_recommended' => 'boolean',
        'is_white_labeled' => 'boolean',
        'are_private_projects_allowed' => 'boolean',
        'are_file_attachments_allowed' => 'boolean',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    /**
     * Determines whether the Stripe Product is free.
     *
     * @return bool
     */
    public function isFree(): bool
    {
        return $this->price == 0;
    }

    /**
     * Get the discounted monthly price in cents.
     */
    public function getDiscountedMonthlyPrice(
        $isRoundedUp = true
    ) {
        $discountDecimal = $this->yearly_discount_percentage / 100;
        $discountedYearlyPrice = $this->price * 12 * (1 - $discountDecimal);
        $discountedMonthlyPrice = $discountedYearlyPrice / 12;
        $discountedMonthlyPriceRoundUp = $isRoundedUp ? (int) ceil($discountedMonthlyPrice / 100) * 100 : $discountedMonthlyPrice;

        return $discountedMonthlyPriceRoundUp;
    }

    /**
     * Get all of the free plans.
     */
    public function scopeFree($query): Builder
    {
        return $query->where('price', 0);
    }

    /**
     * Get all of the Stripe plans.
     */
    public function scopeStripe($query): Builder
    {
        return $query->where('provider', PlanProviderEnum::STRIPE);
    }

    /**
     * Get all of the AppSumo plans.
     */
    public function scopeAppsumo($query): Builder
    {
        return $query->where('provider', PlanProviderEnum::APPSUMO);
    }
}
