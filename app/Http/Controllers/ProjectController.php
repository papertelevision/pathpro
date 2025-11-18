<?php

namespace App\Http\Controllers;

use App\Domain\Project\Actions\CreateProjectAction;
use App\Domain\Project\Actions\UpdateProjectAction;
use App\Http\Domain\Project\Requests\StoreProjectRequest;
use App\Http\Domain\Project\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Domain\Project\Models\Project;
use App\Domain\User\Actions\CheckPageWhiteLabelingAction;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(
        Request $request,
    ) {
        $authUser = $request->user();

        $assignedAsAdminOrTeamMemberToProjects = $authUser->assignedAsAdminOrTeamMemberToProjects()->select('id')->get()->pluck('id')->toArray();
        $assignedAsAdminOrTeamMemberToProjects = Project::whereIn('id', $assignedAsAdminOrTeamMemberToProjects)
            ->withCount([
                'tasks',
                'features',
                'submissions',
                'teamMembers',
                'communityMembers',
                'newSubmissions',
                'newCommunityMembers',
            ])->with([
                'header',
                'creator.media',
                'teamMembers.media',
                'teamMembers.permissions',
                'communityMembers.media',
                'bannedCommunityMembers.media',
                'bannedTeamMembers.media',
            ])
            ->get();

        $assignedAsCommunityMember = $authUser->assignedAsCommunityMemberToProjects()->public()->select('id')->get()->pluck('id')->toArray();
        $assignedAsCommunityMember = Project::whereIn('id', $assignedAsCommunityMember)
            ->withCount([
                'features',
                'releaseNotes',
            ])
            ->with([
                'header',
                'creator.media',
            ])
            ->get();

        $projects = $assignedAsAdminOrTeamMemberToProjects->merge($assignedAsCommunityMember);

        return ProjectResource::collection($projects);
    }

    public function show(
        Request $request,
        Project $project,
        CheckPageWhiteLabelingAction $checkPageWhiteLabelingAction,
    ) {
        if (
            $project->isArchived() &&
            (!auth()->check() ||
                $project->communityMembers->contains($request->user()))
        ) {
            abort(404, 'The project is archived.');
        }

        if (
            auth()->check() &&
            $project->bannedMembers->contains($request->user())
        ) {
            abort(403, 'You are banned from this project!');
        }

        if (
            $project->communityMembers->contains($request->user()) ||
            !auth()->check()
        ) {
            $project
                ->unsetRelations()
                ->loadCount([
                    'features',
                    'releaseNotes',
                ])
                ->load([
                    'header',
                    'latestLiveNews.author.media',
                    'creator.media',
                    'taskGroups.media',
                    'featureGroups'
                ]);
        } else {
            $project
                ->loadCount([
                    'tasks',
                    'features',
                    'submissions',
                    'releaseNotes',
                ])
                ->load([
                    'header',
                    'creator.media',
                    'teamMembers.media',
                    'teamMembers.permissions' => function ($query) use ($project) {
                        $query->where('project_id', $project->id);
                    },
                    'communityMembers.media',
                    'taskGroups.media',
                    'featureGroups',
                    'latestLiveNews.author.media',
                ]);
        }

        $project->is_page_white_labeled = $checkPageWhiteLabelingAction->handle($project);

        return ProjectResource::make($project);
    }

    public function store(
        StoreProjectRequest $request,
        CreateProjectAction $createProjectAction
    ) {
        $validated = $request->validated();
        $project = $createProjectAction->handle($validated);

        return $project;
    }

    public function update(
        UpdateProjectRequest $request,
        Project $project,
        UpdateProjectAction $updateProjectAction
    ) {
        $updateProjectAction->handle(
            $project,
            $request->user(),
            $request->validated()
        );

        return $project->slug;
    }

    public function destroy(
        Project $project
    ) {
        $project->delete();
    }
}
