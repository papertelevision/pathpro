<?php

namespace App\Http\Controllers;

use App\Domain\Project\Models\Project;
use App\Domain\ReleaseNote\Models\ReleaseNote;
use App\Domain\Task\Models\Task;
use App\Domain\ReleaseNote\Actions\UpdateReleaseNoteTasksAction;
use App\Domain\User\Models\User;
use App\Http\Domain\ReleaseNote\Requests\StoreReleaseNoteRequest;
use App\Http\Domain\ReleaseNote\Requests\UpdateReleaseNoteRequest;
use App\Http\Domain\ReleaseNote\Requests\BulkDestroyReleaseNoteRequest;
use App\Http\Resources\ReleaseNoteResource;
use App\Notifications\ReleaseNoteCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class ProjectReleaseNoteController extends Controller
{
    public function index(
        Request $request,
        Project $project
    ) {
        $author = User::where('username', $request->input('author'))->first();

        $releaseNotes = $project->releaseNotes()
            ->orderByDesc('id')
            ->when($request->input('status'), function ($query) use ($request) {
                $requestStatus = $request->input('status');

                if (
                    $requestStatus != 'All'
                    && !is_null($requestStatus)
                    && $requestStatus != 'Trash'
                ) {
                    $query->where(['status' => $requestStatus]);
                }

                if ($requestStatus === 'Trash') {
                    $query->onlyTrashed();
                }
            })
            ->when($author, function ($query) use ($author) {
                $query->where(['author_id' => $author->id]);
            });

        if (
            $project->communityMembers->contains($request->user()) ||
            !auth()->check()
        ) {
            $releaseNotes = $releaseNotes
                ->with([
                    'author.media',
                    'tasks.taskGroup.media',
                    'tasks.taskType',
                    'tasks.taskStatus',
                    'tasks.teamMembers.media',
                    'tasks.teamMembers.permissions' => function ($query) use ($project) {
                        return $query->where('project_id', $project->id);
                    },
                    'tasks.communityMembers.media',
                    'tasks.communityMembers.permissions' => function ($query) use ($project) {
                        return $query->where('project_id', $project->id);
                    },
                    'tasks.upvotes',
                    'tasks.comments.author.media',
                    'tasks.comments.upvotes',
                    'tasks.comments.children.author.media',
                    'tasks.comments.children.upvotes',
                ]);
        } else {
            $releaseNotes = $releaseNotes
                ->with([
                    'author.media',
                    'author.permissions' => function ($query) use ($project) {
                        return $query->where('project_id', $project->id);
                    },
                    'tasks.project',
                    'tasks.taskGroup.media',
                    'tasks.taskType',
                    'tasks.taskStatus',
                    'tasks.teamMembers.media',
                    'tasks.communityMembers.media',
                    'tasks.upvotes',
                    'tasks.comments.author.media',
                    'tasks.comments.upvotes',
                    'tasks.comments.children.author.media',
                    'tasks.comments.children.upvotes',
                ]);
        }

        $releaseNotes = $releaseNotes->orderByDesc('created_at')->paginate(10);

        return ReleaseNoteResource::collection($releaseNotes)->additional(['meta' => [
            'allTotals' => $project->releaseNotes()->when($author, function ($query) use ($author) {
                $query->where(['author_id' => $author->id]);
            })->count(),

            'publishedTotals' =>  $project->releaseNotes()->when($author, function ($query) use ($author) {
                $query->where(['author_id' => $author->id]);
            })->where(['status' => 'Published'])->count(),

            'draftTotals' =>  $project->releaseNotes()->when($author, function ($query) use ($author) {
                $query->where(['author_id' => $author->id]);
            })->where(['status' => 'Draft'])->count(),

            'deletedTotals' =>  $project->releaseNotes()->when($author, function ($query) use ($author) {
                $query->where(['author_id' => $author->id]);
            })->onlyTrashed()->count(),
        ]]);
    }

    public function show(
        ReleaseNote $releaseNote
    ) {
        return ReleaseNoteResource::make($releaseNote->load([
            'author.media',
            'author.permissions' => function ($query) use ($releaseNote) {
                return $query->where('project_id', $releaseNote->project->id);
            },
            'project',
            'tasks'
        ]));
    }

    public function store(
        StoreReleaseNoteRequest $request,
        Project $project
    ) {
        if ($request->user()->cannot('create', [ReleaseNote::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();
        $validated['author_id'] = auth()->id();

        $releaseNote = ReleaseNote::create($validated);

        foreach ($request->tasks as $task) {
            Task::find($task['id'])->fill([
                'release_note_id' => $releaseNote->id
            ])->save();
        }

        $members = $project->communityMembers->merge($project->teamMembers);
        foreach ($members as $member) {
            Notification::send(
                $member,
                new ReleaseNoteCreatedNotification(
                    $releaseNote
                )
            );
        }

        return $releaseNote;
    }

    public function update(
        UpdateReleaseNoteRequest $request,
        UpdateReleaseNoteTasksAction $updateReleaseNoteTasksAction,
        ReleaseNote $releaseNote
    ) {
        $releaseNote->fill($request->validated())->save();

        $updateReleaseNoteTasksAction->handle($request, $releaseNote);

        return $releaseNote;
    }

    public function bulkDestroy(
        BulkDestroyReleaseNoteRequest $request
    ) {
        $validated = $request->validated();

        foreach ($validated['release_notes'] as $releaseNoteId) {
            $submission = ReleaseNote::find($releaseNoteId);
            $submission->update(['status' => 'Deleted']);
            $submission->delete();
        }

        return response([
            'message' => 'success',
        ]);
    }
}
