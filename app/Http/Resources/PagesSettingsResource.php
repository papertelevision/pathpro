<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PagesSettingsResource extends JsonResource
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
            'pricing_page_url' => $this['pricing_page_url'],
            'terms_of_purchase_page_url' => $this['terms_of_purchase_page_url'],
        ];
    }
}
