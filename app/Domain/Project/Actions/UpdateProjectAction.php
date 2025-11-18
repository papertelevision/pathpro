<?php

namespace App\Domain\Project\Actions;

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

class UpdateProjectAction
{
    /**
     * @var \App\Domain\Project\Actions\AssignUserToProjectAction
     */
    protected $assignUserToProjectAction;

    /**
     * Constructor.
     *
     * @return void
     */
    public function __construct(
        AssignUserToProjectAction $assignUserToProjectAction,
    ) {
        $this->assignUserToProjectAction = $assignUserToProjectAction;
    }

    /**
     * Handles the action.
     *
     * @param  \App\Domain\Project\Models\Project $project
     * @param  \App\Domain\User\Models\User $user
     * @param  array $validated
     * @return void
     */
    public function handle(
        Project $project,
        User $user,
        array $validated
    ) {
        if ($user->canAssignTeamMembers()) {
            $this->assignTeamMembers($project, $validated['team_members']);
        }

        $project->update([
            'title' => $validated['title'],
            'visibility' => $validated['visibility'],
            'date_format' => $validated['date_format'],
            'description' => $validated['description'],
            'is_description_public' => $validated['is_description_public'],
            'is_public_upvoting_allowed' => $validated['is_public_upvoting_allowed'],
            'are_feature_submissions_allowed' => $validated['are_feature_submissions_allowed'],
        ]);

        return $project->fresh();
    }

    /**
     * Assign team members to project.
     *
     * @return \Illuminate\Support\Collection
     */
    protected function assignTeamMembers(Project $project, array $requestTeamMembers)
    {
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
