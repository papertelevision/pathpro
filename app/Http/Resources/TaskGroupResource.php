<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskGroupResource extends JsonResource
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
            'order' => $this->order,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'header_color' => $this->header_color,
            'icon_type' => $this->icon_type,
            'icon_identifier' => $this->icon_identifier,
            'icon_url' => $this->getFirstMediaUrl('icon'),
            'icon_data' => $this->getFirstMedia('icon'),
            'visibility' => $this->visibility,
            'is_percentage_complete_visible' => $this->is_percentage_complete_visible,
            'is_planned_release_date_include' => $this->is_planned_release_date_include,
            'planned_release_type' => $this->planned_release_type?->label,
            'planned_release_start_date' => $this->planned_release_start_date,
            'planned_release_end_date' => $this->planned_release_end_date,
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'percentage_complete' => $this->percentageComplete()
        ];
    }
}
