<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberInvitationResource extends JsonResource
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
            'user_id' => $this->user_id,
            'created_at' => Carbon::parse($this->created_at)->format('m-d-y'),
            'projects' => $this->whenLoaded('projects', function () {
                return $this->projects->pluck('slug')->map(function ($slug) {
                    return ['slug' => $slug];
                });
            }),
        ];
    }
}
