<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubmissionResource;
use App\Domain\Project\Models\Project;
use App\Domain\Submission\Enums\SubmissionStatusEnum;
use App\Domain\Submission\Models\Submission;
use App\Http\Domain\Submission\Requests\BulkDestroySubmissionRequest;
use App\Http\Domain\Submission\Requests\StoreSubmissionRequest;
use App\Http\Domain\Submission\Requests\UpdateSubmissionRequest;
use App\Notifications\SubmissionCreatedNotification;
use App\Notifications\SubmissionReceivedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class ProjectSubmissionController extends Controller
{
    public function index(
        Request $request
    ) {
        $authUser = $request->user();
        $assignedAsAdminOrTeamMemberToProjects = $authUser->assignedAsAdminOrTeamMemberToProjects;
        $project = Project::where('slug', $request->input('project'))->first();
        $status = $request->input('status');

        $submissions =
            Submission::whereHas('project', function ($query) use ($status, $project, $assignedAsAdminOrTeamMemberToProjects) {
                isset($project)
                    ? $query->where('project_id', $project->id)
                    : $query->whereIn('project_id', $assignedAsAdminOrTeamMemberToProjects->pluck('id')->toArray());

                if ($status && $status != 'All') {
                    if ($status === 'noStatusApplied') {
                        $query->where(['status' => NULL]);
                    } else {
                        $query->where(['status' => $status]);
                    }
                }

                return $query;
            })
            ->with([
                'author.media',
                'author.permissions' => function ($query) use ($project) {
                    if (isset($project)) {
                        $query->where('project_id', $project->id);
                    }
                },
                'project'
            ])
            ->orderByDesc('created_at')
            ->paginate(10);

        if ($request->user()->cannot('viewAny', [Submission::class, $submissions, $project])) {
            abort(403);
        }

        return SubmissionResource::collection($submissions);
    }

    public function show(
        Project $project,
        Submission $submission
    ) {
        return new SubmissionResource(
            $submission->load([
                'author.media',
                'author.permissions' => function ($query) use ($project) {
                    return $query->where('project_id', $project->id);
                },
            ])
        );
    }

    public function edit(
        Request $request,
        Project $project,
        Submission $submission
    ) {
        if ($request->user()->cannot('view', [Submission::class, $submission])) {
            abort(401);
        }

        return view('index');
    }

    public function store(
        StoreSubmissionRequest $request,
    ) {
        $user = $request->user();
        $validated = $request->validated();
        $validated['status'] = SubmissionStatusEnum::NEW;
        $validated['author_id'] = $user->id;
        $project = Project::find($validated['project_id']);

        if ($request->user()->cannot('create', [Submission::class, $project])) {
            abort(403);
        }

        $submission = $project->submissions()->create($validated);

        if ($user->assignedAsCommunityMemberToProjects->contains($project)) {

            $members = $project->adminMembers->merge($project->teamMembers);
            foreach ($members as $member) {
                Notification::send(
                    $member,
                    new SubmissionCreatedNotification(
                        $user,
                        $submission
                    )
                );
            }

            Notification::send(
                $user,
                new SubmissionReceivedNotification(
                    $project
                )
            );
        }

        return response([
            'message' => 'success',
        ]);
    }

    public function update(
        UpdateSubmissionRequest $request,
        Submission $submission
    ) {
        $validated = $request->validated();
        $status = is_null($validated['status']) ? $validated['status'] : SubmissionStatusEnum::from($validated['status']);

        if ($validated['is_highlighted']) {
            $status = SubmissionStatusEnum::HIGHLIGHTED;
        }

        $submission->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_highlighted' => $validated['is_highlighted'],
            'status' => $status
        ]);

        return response([
            'message' => 'success',
        ]);
    }

    public function bulkDestroy(
        BulkDestroySubmissionRequest $request,
    ) {
        $validated = $request->validated();

        foreach ($validated['submissions'] as $submissionID) {
            $submission = Submission::find($submissionID);

            if ($request->user()->cannot('delete', [Submission::class, $submission->project])) {
                abort(403);
            }

            $submission->update(['status' => SubmissionStatusEnum::DELETED]);
            $submission->delete();
        }

        return response([
            'message' => 'success',
        ]);
    }
}
