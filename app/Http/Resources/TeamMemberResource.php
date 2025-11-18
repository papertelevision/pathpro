<?php

namespace App\Http\Resources;

use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\User\Enums\UserRoleEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
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
            'is_rank_visible' => $this->is_rank_visible,
            'permissions' => ($this->whenLoaded(
                'permissions',
                fn () =>
                $this->permissions->pluck('pivot')->map(function ($permission) {
                    $permission->project_title = $permission->project->title;
                    return $permission;
                })
            )),
            'available_permissions' => ProjectUserPermissionEnum::valuesWithLabels(),
            'submissions_count' => $this->whenLoaded('submissions', fn () => $this->submissions->count()),
            'adopted_submissions_count' => $this->whenLoaded('adoptedSubmissions', fn () => $this->adoptedSubmissions->count()),
            'features_and_tasks_upvoted_count' => $this->whenLoaded('upvotedTasksAndFeatures', fn () => $this->upvotedTasksAndFeatures->count()),
            'comments_upvoted' => $this->whenLoaded('upvotedComments', fn () => $this->upvotedComments->count()),
            'comments_count' => $this->whenLoaded('comments', fn () => $this->comments->count()),
            'highlighted_comments_count' => $this->whenLoaded('comments', fn () => $this->comments->where('is_comment_highlighted')->count()),
            'deleted_at' => $this->deleted_at,
            'is_joined' => $this->role !== UserRoleEnum::INACTIVE
        ];
    }
}
