<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserStripeProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'features' => $this->features,
            'monthly_price' => number_format($this->price / 100, 2),
            'discounted_monthly_price' => number_format($this->getDiscountedMonthlyPrice(!isset($this->is_coupon_used)) / 100, 2),
            'yearly_discount_percentage' => $this->yearly_discount_percentage,
            'projects_count' => is_null($this->projects_count) ? 'UNLIMITED' : $this->projects_count,
            'community_members_count' => is_null($this->community_members_count) ? 'UNLIMITED' : $this->community_members_count,
            'team_members_count' => is_null($this->team_members_count) ?  'UNLIMITED' : $this->team_members_count,
            'tech_support_type' => $this->tech_support_type,
            'is_recommended' => $this->is_recommended,
            'is_free' => $this->isFree(),
        ];
    }
}
