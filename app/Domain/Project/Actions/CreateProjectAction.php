<?php

namespace App\Domain\Project\Actions;

use App\Domain\FeatureGroup\Actions\CreateFeatureGroupAction;
use App\Domain\Project\Actions\AssignUserToProjectAction;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Models\User;
use App\Notifications\TeamMemberInvitationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class CreateProjectAction
{
    protected $assignUserToProjectAction;
    protected $createFeatureGroupAction;

    public function __construct(
        AssignUserToProjectAction $assignUserToProjectAction,
        CreateFeatureGroupAction $createFeatureGroupAction
    ) {
        $this->assignUserToProjectAction = $assignUserToProjectAction;
        $this->createFeatureGroupAction = $createFeatureGroupAction;
    }

    public function handle(
        array $validated
    ) {
        $project = Project::create([
            'creator_id' => auth()->id(),
            'title' => $validated['title'],
            'date_format' => $validated['date_format'],
            'description' => $validated['description'],
            'visibility' => $validated['visibility'],
            'is_description_public' => $validated['is_description_public'],
            'is_public_upvoting_allowed' => $validated['is_public_upvoting_allowed'],
            'are_feature_submissions_allowed' => $validated['are_feature_submissions_allowed'],
        ]);

        $project->adminMembers()->attach(auth()->id(), [
            'role' => ProjectUserRoleEnum::admin,
            'permission' => json_encode(['*']),
            'is_joined' => true
        ]);

        $this->assignTeamMembers($project, $validated['team_members']);

        $this->createFeatureGroupAction->handle($project);

        return $project->fresh();
    }

    protected function assignTeamMembers(
        Project $project,
        array $requestTeamMembers
    ) {
        $teamMembersToBeAdded = User::whereIn('id', collect($requestTeamMembers)->diff($project->teamMembers->pluck('id')))->get();

        foreach ($teamMembersToBeAdded as $teamMember) {
            $invitation = TeamMemberInvitation::create([
                'user_id' => $teamMember->id,
                'token' => Str::random(12)
            ]);

            $invitation->projects()->attach($project->id);

            Notification::send(
                $teamMember,
                new TeamMemberInvitationNotification(
                    $invitation
                )
            );

            $this->assignUserToProjectAction->handle(
                $project,
                $teamMember,
                ProjectUserPermissionEnum::values(),
                ProjectUserRoleEnum::teamMember,
                UserRankEnum::TEAM_MEMBER
            );
        }
    }
}
