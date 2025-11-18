<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'accent_color' => $this->accent_color,
            'creator_id' => $this->creator_id,
            'creator' => new UserResource($this->whenLoaded('creator')),
            'title' => $this->title,
            'description' => $this->description,
            'is_description_public' => $this->is_description_public,
            'visibility' => $this->visibility,
            'is_public_upvoting_allowed' => $this->is_public_upvoting_allowed,
            'are_feature_submissions_allowed' => $this->are_feature_submissions_allowed,
            'updated_at' => $this->updated_at,
            'tasks_count' => $this->tasks_count,
            'task_groups' => TaskGroupResource::collection($this->whenLoaded('taskGroups')),
            'team_members' => TeamMemberResource::collection($this->whenLoaded('teamMembers')),
            'team_members_count' => $this->team_members_count,
            'community_members' => CommunityMemberResource::collection($this->whenLoaded('communityMembers')),
            'new_community_members_count' => $this->new_community_members_count,
            'community_members_count' => $this->community_members_count,
            'banned_community_members' => CommunityMemberResource::collection($this->whenLoaded('bannedCommunityMembers')),
            'banned_team_members' => CommunityMemberResource::collection($this->whenLoaded('bannedTeamMembers')),
            'features_count' => $this->features_count,
            'features_group' => new FeatureGroupResource($this->whenLoaded('featureGroups')),
            'release_notes' => ReleaseNoteResource::collection($this->whenLoaded('releaseNotes')),
            'release_notes_count' => $this->release_notes_count,
            'news' => NewsResource::collection($this->whenLoaded('news')),
            'latest_news_update' => NewsResource::make($this->whenLoaded('latestLiveNews')),
            'submissions' => SubmissionResource::collection($this->whenLoaded('submissions')),
            'submissions_count' => $this->submissions_count,
            'new_submissions_count' => $this->new_submissions_count,
            'tabs' => $this->whenLoaded('header', fn() => $this->header?->getTabs()),
            'submit_feedback_button_text' => $this->whenLoaded('header', fn() => $this->header->getSubmitFeedbackButtonText()),
            'is_page_white_labeled' => $this?->is_page_white_labeled,
            'is_custom_domain_configured' => $this->isCustomDomainConfigured(),
            'date_format' => $this->date_format,
        ];
    }
}
