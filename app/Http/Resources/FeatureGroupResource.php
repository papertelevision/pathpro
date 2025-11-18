<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeatureGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'header_color' => $this->header_color,
            'icon_type' => $this->icon_type,
            'icon_identifier' => $this->icon_identifier,
            'icon_url' => $this->getFirstMediaUrl('feature-group-icon'),
            'icon_data' => $this->getFirstMedia('feature-group-icon'),
            'updated_at' => $this->updated_at,
        ];
    }
}
