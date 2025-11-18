<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'content' => $this->content,
            'is_comment_pinned_to_top' => $this->is_comment_pinned_to_top,
            'is_comment_highlighted' => $this->is_comment_highlighted,
            'author' => new UserResource($this->whenLoaded('author')),
            'created_at' => $this->created_at,
            'commentable_id' => $this->commentable_id,
            'commentable_type' => $this->commentable_type,
            'replies' => CommentResource::collection($this->whenLoaded('children')),
            'upvotes' => $this->whenLoaded('upvotes'),
            'upvotes_count' => $this->whenLoaded('upvotes', function () {
                return $this->upvotes->count();
            }),
            'parent_comment_id' => $this->parent_comment_id,
            'attachments' => $this->when($this->canViewAttachments($request), function () {
                return $this->getMedia('attachments')->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'name' => $media->name,
                        'file_name' => $media->file_name,
                        'mime_type' => $media->mime_type,
                        'size' => $media->size,
                        'url' => $media->getUrl(),
                        'created_at' => $media->created_at,
                    ];
                });
            }),
        ];
    }

    /**
     * Check if the current user can view attachments (Admin or Team Member only).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function canViewAttachments($request)
    {
        $user = $request->user();

        if (!$user) {
            return false;
        }

        // Get the commentable (Task or Feature) and then get the project
        $commentable = $this->commentable;

        if (!$commentable) {
            return false;
        }

        $project = $commentable->project;

        if (!$project) {
            return false;
        }

        // Check if user is admin member
        $isAdmin = $project->adminMembers()
            ->where('users.id', $user->id)
            ->exists();

        if ($isAdmin) {
            return true;
        }

        // Check if user is team member
        $isTeamMember = $project->teamMembers()
            ->where('users.id', $user->id)
            ->exists();

        return $isTeamMember;
    }
}
