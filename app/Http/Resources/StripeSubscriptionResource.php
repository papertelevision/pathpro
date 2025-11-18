<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class StripeSubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $stripeSubscription = $this->asStripeSubscription();

        return [
            'amount_due' => number_format($this->upcomingInvoice()?->amount_due / 100, 2),
            'is_monthly' => $stripeSubscription->items->data[0]->price->recurring->interval  === 'month',
            'current_period_end' => Carbon::createFromTimestamp($stripeSubscription->current_period_end)?->format('m-d-y'),
        ];
    }
}
