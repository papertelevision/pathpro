<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BannedMemberResource extends JsonResource
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
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => $this->getFirstMediaUrl('avatar'),
            'biography' => $this->biography,
            'rank' => ($this->whenLoaded(
                'permissions',
                fn () => UserPermissionResource::make($this->permissions->pluck('pivot')->first())
            )),
            'is_banned' => true,
        ];
    }
}
