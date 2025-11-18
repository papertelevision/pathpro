<?php

namespace App\Http\Resources;

use App\Domain\User\Enums\UserRankEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $canCreateProjects = $this->canCreateProjects();
        $hasToCreateProject = $this->projects_count === 0 && $canCreateProjects;
        $hasPlan = $this->hasPlan();

        $arePrivateProjectsAllowed = false;
        if ($this->isSuperAdmin()) {
            $arePrivateProjectsAllowed = true;
        } else if ($hasPlan) {
            $arePrivateProjectsAllowed = $this->plan->plan->are_private_projects_allowed;
        }

        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => $this->getFirstMediaUrl('avatar'),
            'biography' => $this->biography,
            'is_super_admin' => $this->isSuperAdmin(),
            'has_finished_onboarding' => $this->has_finished_onboarding,
            'permissions' => ($this->whenLoaded(
                'permissions',
                fn() =>
                $this->permissions->pluck('pivot')->map(function ($permission) {
                    $permission->project_slug = $permission->project->slug;
                    $permission->rank_label = is_null($permission->rank) ?: UserRankEnum::getLabel($permission->rank);
                    return $permission;
                })
            )),
            'projects_count' => $this->projects_count,
            'team_members_count' => $this->getTeamMembersCount(),
            'community_members_count' => $this->getCommunityMembersCount(),
            'submissions_count' => $this->whenLoaded('submissions', fn() => $this->submissions->count()),
            'adopted_submissions_count' => $this->whenLoaded('adoptedSubmissions', fn() => $this->adoptedSubmissions->count()),
            'features_and_tasks_upvoted_count' => $this->whenLoaded('upvotedTasksAndFeatures', fn() => $this->upvotedTasksAndFeatures->count()),
            'comments_upvoted' => $this->whenLoaded('upvotedComments', fn() => $this->upvotedComments->count()),
            'comments_count' => $this->whenLoaded('comments', fn() => $this->comments->count()),
            'highlighted_comments_count' => $this->whenLoaded('comments', fn() => $this->comments->where('is_comment_highlighted')->count()),
            'pm_last_four' => $this->pm_last_four,
            'plan' => PlanUserResource::make($this->whenLoaded('plan')),
            'has_plan' => $hasPlan,
            'can_create_projects' => $canCreateProjects,
            'can_assign_team_members' => $this->canAssignTeamMembers(),
            'can_have_community_members' => $this->canHaveCommunityMembers(),
            'has_to_create_project' => $hasToCreateProject,
            'is_page_white_labeled' => $this?->is_page_white_labeled,
            'are_private_projects_allowed' => $arePrivateProjectsAllowed,
        ];
    }
}
