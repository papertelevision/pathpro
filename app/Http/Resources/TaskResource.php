<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'task_type' => new TaskTypeResource($this->whenLoaded('taskType')),
            'are_subtasks_allowed' => $this->are_subtasks_allowed,
            'created_at' => $this->created_at,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'project_id' => $this->project_id,
            'task_group_id' => $this->task_group_id,
            'task_group' => TaskResource::make($this->whenLoaded('taskGroup')),
            'visibility' => $this->visibility,
            'task_status' => new TaskStatusResource($this->whenLoaded('taskStatus')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'team_members' => UserResource::collection($this->whenLoaded('teamMembers')),
            'community_members' => UserResource::collection($this->whenLoaded('communityMembers')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->comments_count,
            'highlighted_comments_count' => $this->highlighted_comments_count,
            'upvotes' => $this->whenLoaded('upvotes'),
            'upvotes_count' => $this->upvotes_count,
            'order' => $this->order,
            'is_task_upvoting_enabled' => $this->is_task_upvoting_enabled,
            'are_comments_enabled' => $this->are_comments_enabled,
            'are_stats_public' => $this->are_stats_public,
            'is_comment_upvoting_allowed' => $this->is_comment_upvoting_allowed,
            'are_team_members_visible' => $this->are_team_members_visible,
            'is_creator_visible' => $this->is_creator_visible,
            'parent_task_id' => $this->parent_task_id,
            'subtasks' => TaskResource::collection($this->whenLoaded('children')),
            'subtasks_count' => $this->children_count,
            'subscribers' => $this->whenLoaded('subscribers'),
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
            'model_type' => 'task',
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

        // Get the project from the task
        $project = $this->project;

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
