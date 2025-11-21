<?php

namespace App\Http\Controllers;

use App\Domain\Comment\Models\Comment;
use App\Domain\Feature\Models\Feature;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Http\Domain\Comment\Requests\StoreCommentRequest;
use App\Http\Domain\Comment\Requests\UpdateCommentRequest;
use App\Events\CommentCreatedEvent;

class CommentController extends Controller
{
    public function store(
        StoreCommentRequest $request,
        Project $project,
    ) {
        if ($request->user()->cannot('create', [Comment::class, $project])) {
            abort(403);
        }

        $authUser = $request->user();
        $validated = $request->validated();
        $validated['author_id'] = $authUser->id;

        if ($validated['commentable_type'] === 'task') {
            $model = Task::find($validated['commentable_id']);
        } else if ($validated['commentable_type'] === 'feature') {
            $model = Feature::find($validated['commentable_id']);
        } else {
            return response(['message' => 'Unknown commentable type.'], 400);
        }

        if (is_null($model)) {
            return response(['message' => 'Record not found.'], 404);
        }

        $comment = $model->comments()->create([
            'author_id' => $authUser->id,
            'content' => $validated['content'],
            'is_comment_pinned_to_top' => $validated['is_comment_pinned_to_top'],
            'is_comment_highlighted' => $validated['is_comment_highlighted'] ?? false,
            'parent_comment_id' => $validated['parent_comment_id'] ?? null,
        ]);

        // Handle file attachments
        if (isset($validated['attachments']) && is_array($validated['attachments'])) {
            foreach ($validated['attachments'] as $attachment) {
                $comment->addMedia($attachment)->toMediaCollection('attachments');
            }
        }

        event(new CommentCreatedEvent([
            'subscribable' => $model,
            'comment' => $comment,
        ]));

        return $comment;
    }

    public function update(
        UpdateCommentRequest $request,
        Comment $comment
    ) {
        return $comment->fill($request->validated())->save();
    }

    public function destroy(
        Comment $comment
    ) {
        $comment->delete();

        return response([
            'message' => 'success',
        ]);
    }
}
