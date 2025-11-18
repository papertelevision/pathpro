<?php

namespace App\Http\Controllers;

use App\Http\Resources\NewsResource;
use App\Domain\News\Models\News;
use App\Domain\Project\Models\Project;
use App\Domain\News\Actions\ArchiveLiveNewsAction;
use App\Domain\News\Enums\NewsStatusEnum;
use App\Domain\User\Models\User;
use App\Http\Domain\News\Requests\BulkDestroyNewsRequest;
use App\Http\Domain\News\Requests\StoreNewsRequest;
use App\Http\Domain\News\Requests\UpdateNewsRequest;
use Illuminate\Http\Request;

class ProjectNewsController extends Controller
{
    public function index(
        Request $request,
        Project $project
    ) {
        $newsQuery = $project
            ->news()
            ->when($request->input('author'), function ($query) use ($request) {
                if ($author = User::where('username', $request->input('author'))->first()) {
                    $query->byAuthor($author);
                }
            });

        $news = (clone $newsQuery)
            ->with('author.media')
            ->when($request->input('status'), function ($query) use ($request) {
                if ($status = NewsStatusEnum::tryFrom($request->input('status'))) {
                    $query->withStatus($status);
                }
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return NewsResource::collection($news)
            ->additional([
                'meta' => [
                    'allTotals' => $newsQuery->count(),
                    'liveTotals' => (clone $newsQuery)->withStatus(NewsStatusEnum::live())->count(),
                    'draftTotals' => (clone $newsQuery)->withStatus(NewsStatusEnum::draft())->count(),
                    'archivedTotals' => (clone $newsQuery)->withStatus(NewsStatusEnum::archived())->count(),
                    'deletedTotals' => (clone $newsQuery)->withStatus(NewsStatusEnum::deleted())->count(),
                ]
            ]);
    }

    public function show(
        News $news
    ) {
        return NewsResource::make($news->load([
            'author',
            'author.media',
            'author.permissions' => function ($query) use ($news) {
                return $query->where('project_id', $news->project->id);
            },
            'project',
        ]));
    }

    public function store(
        StoreNewsRequest $request,
        Project $project,
        ArchiveLiveNewsAction $archiveLiveNewsAction
    ) {
        if ($request->user()->cannot('create', [News::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        if ($validated['is_draft']) {
            $validated['status'] = NewsStatusEnum::draft();
        } else {
            $validated['status'] = NewsStatusEnum::live();
            $archiveLiveNewsAction->handle($project);
        }

        $project->news()->create([
            'title' => $validated['title'],
            'status' => $validated['status'],
            'author_id' => $request->user()->id,
            'description' => $validated['description'],
        ]);

        return response(['message' => 'success']);
    }

    public function update(
        UpdateNewsRequest $request,
        News $news,
        ArchiveLiveNewsAction $archiveLiveNewsAction
    ) {
        $validated = $request->validated();

        if ($validated['is_draft']) {
            $validated['status'] = NewsStatusEnum::draft();
        } else {
            $validated['status'] = NewsStatusEnum::live();
            $archiveLiveNewsAction->handle($news->project);
        }

        $news->fresh()->update([
            'title' => $validated['title'],
            'status' => $validated['status'],
            'description' => $validated['description'],
        ]);

        return $news;
    }

    public function bulkDestroy(
        BulkDestroyNewsRequest $request
    ) {
        $validated = $request->validated();

        foreach ($validated['news'] as $releaseNoteId) {
            $submission = News::find($releaseNoteId);
            $submission->update(['status' => 'Deleted']);
            $submission->delete();
        }

        return response([
            'message' => 'success',
        ]);
    }
}
