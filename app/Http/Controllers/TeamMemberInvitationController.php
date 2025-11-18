<?php

namespace App\Http\Controllers;

use App\Domain\Project\Actions\AssignUserToProjectAction;
use App\Domain\Project\Enums\ProjectUserPermissionEnum;
use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\Project\Models\Project;
use App\Domain\TeamMemberInvitation\Actions\DestroyTeamMemberInvitationAction;
use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Enums\UserRankEnum;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Http\Domain\TeamMemberInvitation\Requests\StoreTeamMemberInvitationRequest;
use App\Http\Resources\TeamMemberInvitationResource;
use App\Notifications\TeamMemberInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Mailer\Exception\TransportException;
use Exception;
use Illuminate\Support\Facades\Log;

class TeamMemberInvitationController extends Controller
{
    public function index(
        Request $request
    ) {
        $authUser = $request->user();
        $assignedAsAdminToProjects = $authUser->assignedAsAdminToProjects;
        $project = Project::where('slug', $request->input('project'))->first();

        $invitations = TeamMemberInvitation::whereHas('projects', function ($query) use ($project, $assignedAsAdminToProjects) {
            isset($project)
                ? $query->where('project_id', $project->id) :
                $query->whereIn('project_id', $assignedAsAdminToProjects->pluck('id')->toArray());
        })
            ->with([
                'projects',
            ])
            ->get();

        return TeamMemberInvitationResource::collection($invitations);
    }

    public function show(
        Request $request,
        DestroyTeamMemberInvitationAction $destroyTeamMemberInvitationAction
    ) {
        if (!$request->hasValidSignature(false)) {
            abort(401);
        }

        $user = $request->user();
        if ($user) {
            $invitation = TeamMemberInvitation::find($request->input('invitation'));

            if ($invitation) {
                $destroyTeamMemberInvitationAction->handle(
                    $invitation,
                    $user
                );
            }
        }

        return view('index');
    }

    public function store(
        StoreTeamMemberInvitationRequest $request,
        AssignUserToProjectAction $assignUserToProjectAction,
    ) {
        $validated = $request->validated();
        $authUser = $request->user();

        if (!$authUser->canAssignTeamMembers()) {
            abort(403);
        }

        $projects = Project::whereIn('id', $validated['projects'])->get();

        foreach ($projects as $project) {
            if ($authUser->cannot('manageCommunityAndTeamMembers', [User::class, $project])) {
                abort(403);
            }
        }

        $memberEmail = $validated['email'];
        $userModel = User::where('email', $memberEmail)->first();

        try {
            DB::beginTransaction();

            $username = strstr($memberEmail, '@', true);
            $i = 0;
            while (User::where('username', $username)->exists()) {
                $i++;
                $username = $username . $i;
            }

            if (is_null($userModel)) {
                $userModel = User::create([
                    'username' => $username,
                    'role' => UserRoleEnum::INACTIVE,
                    'email' => $memberEmail,
                    'password' => Hash::make(Str::password()),
                    'api_token' => Str::random(60),
                ]);

                $userModel
                    ->addMedia(resource_path('images/user-default-img.png'))
                    ->preservingOriginal()
                    ->toMediaCollection('avatar');
            } else {
                foreach ($projects as $project) {
                    $alreadyInvited = $userModel->invitations()->whereHas(
                        'projects',
                        function ($query) use ($project) {
                            return $query->where('project_id', $project->id);
                        }
                    )->first();

                    if ($alreadyInvited) {
                        return response()->json([
                            'message' => 'This user has already been invited to the project ' . $project->title . '!'
                        ], 403);
                    }
                }
            }

            $invitation = TeamMemberInvitation::create([
                'user_id' => $userModel->id,
                'token' => Str::random(12)
            ]);

            foreach ($projects as $project) {
                $assignUserToProjectAction->handle(
                    $project,
                    $userModel,
                    ProjectUserPermissionEnum::values(),
                    ProjectUserRoleEnum::teamMember,
                    UserRankEnum::TEAM_MEMBER
                );

                $invitation->projects()->attach($project->id);
            }

            Notification::send(
                $userModel,
                new TeamMemberInvitationNotification(
                    $invitation->fresh()
                )
            );

            DB::commit();

            return response([
                'message' => 'The invitation has been sent!',
            ]);
        } catch (TransportException $e) {
            DB::rollBack();
            Log::error($e);
            return response([
                'message' =>  'There was some error during sending the invitation. Please ensure that the email you have entered is valid!',
            ], 500);
        } catch (Exception $e) {
            DB::rollBack();
            return response([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(
        TeamMemberInvitation $teamMemberInvitation
    ) {
        Notification::send(
            $teamMemberInvitation->user,
            new TeamMemberInvitationNotification(
                $teamMemberInvitation
            )
        );

        return response([
            'message' => 'The invitation has been resent!',
        ]);
    }

    public function bulkUpdate(
        Request $request,
        User $user
    ) {
        $authUser = $request->user();
        $assignedAsAdminToProjects = $authUser->assignedAsAdminToProjects;

        $invitations = $user->invitations()->whereHas('projects', function ($query) use ($assignedAsAdminToProjects) {
            $query->whereIn('project_id', $assignedAsAdminToProjects->pluck('id')->toArray());
        })->get();

        foreach ($invitations as $invitation) {
            Notification::send(
                $user,
                new TeamMemberInvitationNotification(
                    $invitation
                )
            );
        }

        return response([
            'message' => 'The invitations has been resent!',
        ]);
    }

    public function destroy(
        Request $request,
        TeamMemberInvitation $teamMemberInvitation,
        DestroyTeamMemberInvitationAction $destroyTeamMemberInvitationAction
    ) {
        $user = $request->user();

        if (is_null($user)) {
            $request->validate([
                'username' => 'required|string|max:255',
                'email' => 'required|string|email|exists:users,email',
                'password' => ['required', Rules\Password::defaults(), 'confirmed'],
            ]);

            $user = User::whereEmail($request->email)->first();

            $user->update([
                'username' => $request->username,
                'name' => $request->name,
                'nickname' => $request->nickname,
                'biography' => $request->biography,
                'role' => UserRoleEnum::USER,
                'password' => Hash::make($request->password),
            ]);

            $user = $user->fresh();

            event(new Registered($user));
            Auth::login($user, true);
        }

        $destroyTeamMemberInvitationAction->handle(
            $teamMemberInvitation,
            $user
        );

        return response([
            'message' => 'You have joined the project/s successfully!',
        ]);
    }
}
