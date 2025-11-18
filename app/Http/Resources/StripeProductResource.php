<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class StripeProductResource extends JsonResource
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
            'monthly_price' => $this->price / 100,
            'yearly_price' => $this->getDiscountedMonthlyPrice() * 12 / 100,
            'discounted_monthly_price' => $this->getDiscountedMonthlyPrice() / 100,
            'yearly_discount_percentage' => $this->yearly_discount_percentage,
            'projects_count' => is_null($this->projects_count) ? 'UNLIMITED' : $this->projects_count,
            'community_members_count' => is_null($this->community_members_count) ? 'UNLIMITED' : $this->community_members_count,
            'team_members_count' => is_null($this->team_members_count) ?  'UNLIMITED' : $this->team_members_count,
            'tech_support_type' => $this->tech_support_type,
            'is_recommended' => $this->is_recommended,
            'created_at' => Carbon::parse($this->created_at)->format('m-d-y'),
            'get_started_monthly_url' => route('stripe-product-register.create', ['plan' => $this, 'subscription-type' => 'monthly']),
            'get_started_yearly_url' => route('stripe-product-register.create', ['plan' => $this, 'subscription-type' => 'yearly']),
            'is_free' => $this->isFree(),
        ];
    }
}
