<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeatureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'feature_type' => new FeatureTypeResource($this->whenLoaded('featureTaskType')),
            'is_task_confirmed' => $this->is_task_confirmed,
            'are_stats_public' => $this->are_stats_public,
            'project_id' => $this->project_id,
            'feature_group_id' => $this->feature_group_id,
            'visibility' => $this->visibility,
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->comments_count,
            'highlighted_comments_count' => $this->highlighted_comments_count,
            'upvotes' => $this->whenLoaded('upvotes'),
            'upvotes_count' => $this->upvotes_count,
            'community_members' => UserResource::collection($this->whenLoaded('communityMembers')),
            'community_members_count' => $this->community_members_count,
            'subscribers' => $this->whenLoaded('subscribers'),
            'model_type' => 'feature',
        ];
    }
}
