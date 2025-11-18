<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'avatar' => $this->getFirstMediaUrl('avatar'),
            'biography' => $this->biography,
            'rank' => ($this->whenLoaded(
                'permissions',
                fn () => UserPermissionResource::make($this->permissions->pluck('pivot')->first())
            )),
            'submissions_count' => $this->whenLoaded('submissions', fn () => $this->submissions->count()),
            'adopted_submissions_count' => $this->whenLoaded('adoptedSubmissions', fn () => $this->adoptedSubmissions->count()),
            'tasks_upvoted' => UpvoteResource::collection($this->whenLoaded('upvotedTasks')),
            'tasks_upvoted_count' => $this->whenLoaded('upvotedTasks', fn () => $this->upvotedTasks->count()),
            'comments_upvoted' => $this->whenLoaded('upvotedComments', fn () => $this->upvotedComments->count()),
            'features_upvoted' => $this->whenLoaded('upvotedFeatures', fn () => $this->upvotedFeatures->count()),
            'can_have_community_members' => $this->canHaveCommunityMembers()
        ];
    }
}
