<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Domain\Task\Models\Task;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    /**
     * Get the comments that belongs to the task.
     *
     * @param  \App\Domain\Task\Models\Task $task
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function show(
        Task $task,
        Request $request
    ) {
        $commentsQuery = $task->comments()
            ->with([
                'author.media',
                'author.permissions' => function ($query) use ($task) {
                    return $query->where('project_id', $task->project->id);
                },
                'upvotes',
                'children',
                'children.author.media',
                'children.author.permissions' => function ($query) use ($task) {
                    return $query->where('project_id', $task->project->id);
                },
                'children.upvotes',
            ])
            ->withCount('upvotes')
            ->orderByDesc($request->input('sortBy'))->get();

        return CommentResource::collection($commentsQuery);
    }
}
