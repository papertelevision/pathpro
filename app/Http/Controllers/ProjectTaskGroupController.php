<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskGroupResource;
use App\Domain\Project\Models\Project;
use App\Domain\TaskStatus\Models\TaskStatus;
use App\Domain\TaskType\Models\TaskType;
use App\Http\Resources\TaskStatusResource;
use App\Http\Resources\TaskTypeResource;
use Illuminate\Http\Request;

class ProjectTaskGroupController extends Controller
{
    public function index(
        Request $request,
        Project $project
    ) {
        $canViewDraftedModels = auth()->check() &&
            $request->user()->assignedAsAdminOrTeamMemberToProjects->contains($project);

        $taskGroupsQuery = $project
            ->taskGroups()
            ->when(
                !$canViewDraftedModels,
                fn ($query) => $query->published()
            )
            ->with([
                'media',
                'tasks' => function ($query) use ($canViewDraftedModels) {
                    $query
                        ->withCount([
                            'comments',
                            'highlightedComments',
                            'upvotes'
                        ])
                        ->when(
                            !$canViewDraftedModels,
                            fn ($query) => $query->published()
                        );
                },
                'tasks.taskGroup',
                'tasks.taskType',
                'tasks.taskStatus',
                'tasks.creator.media',
                'tasks.communityMembers.media',
                'tasks.communityMembers.permissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'tasks.teamMembers.media',
                'tasks.teamMembers.permissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'tasks.comments',
                'tasks.upvotes',
                'tasks.subscribers',
                'tasks.children' => function ($query) use ($canViewDraftedModels) {
                    $query
                        ->withCount([
                            'comments',
                            'highlightedComments',
                            'upvotes'
                        ])
                        ->when(
                            !$canViewDraftedModels,
                            fn ($query) => $query->published()
                        );
                },
                'tasks.children.taskType',
                'tasks.children.taskStatus',
                'tasks.children.subscribers',
                'tasks.children.creator.media',
                'tasks.children.communityMembers.media',
                'tasks.children.communityMembers.permissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'tasks.children.teamMembers.media',
                'tasks.children.teamMembers.permissions' => function ($query) use ($project) {
                    $query->where('project_id', $project->id);
                },
                'tasks.children.upvotes',
            ])
            ->get();

        return [
            'types' => TaskTypeResource::collection(TaskType::all()),
            'groups' => TaskGroupResource::collection($taskGroupsQuery),
            'statuses' => TaskStatusResource::collection(TaskStatus::withNoStatusFirst()->get()),
        ];
    }
}
