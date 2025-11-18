<?php

namespace App\Http\Resources;

use App\Domain\Submission\Enums\SubmissionStatusEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $allowHighlighting = false;
        $status = $this->status;
        if (
            $status === SubmissionStatusEnum::HIGHLIGHTED ||
            $status === SubmissionStatusEnum::NEW ||
            is_null($status)
        ) {
            $allowHighlighting = true;
        }

        return [
            'id' => $this->id,
            'author' => new UserResource($this->whenLoaded('author')),
            'project' => new ProjectResource($this->whenLoaded('project')),
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'allow_highlighting' => $allowHighlighting,
            'is_highlighted' => $this->is_highlighted,
            'is_adopted' => $this->isAdopted(),
            'is_denied' => $this->isDenied(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }
}
