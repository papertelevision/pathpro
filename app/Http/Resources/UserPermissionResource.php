<?php

namespace App\Http\Resources;

use App\Domain\User\Enums\UserRankEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $rank = UserRankEnum::valueWithLabel($this->rank);

        return [
            'id' => is_null($rank) ? null : $rank['value'],
            'value' => is_null($rank) ? null : $rank['value'],
            'label' => is_null($rank) ? null : $rank['label'],
            'role' => $this->role,
            'is_rank_visible' => $this->is_rank_visible,
            'is_joined' => $this->is_joined,
        ];
    }
}
