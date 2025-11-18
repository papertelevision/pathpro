<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Models\Feature;
use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;

class FeatureCommentController extends Controller
{
    /**
     * Get the comments that belongs to the feature.
     *
     * @param \App\Domain\Feature\Models\Feature $feature
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function show(
        Feature $feature,
        Request $request
    ) {
        $commentsQuery = $feature->comments()->with([
            'author.media',
            'author.permissions' => function ($query) use ($feature) {
                return $query->where('project_id', $feature->project->id);
            },
            'upvotes',
            'children',
            'children.author.media',
            'children.author.permissions' => function ($query) use ($feature) {
                return $query->where('project_id', $feature->project->id);
            },
            'children.upvotes',
        ])->withCount('upvotes')->orderByDesc($request->input('sortBy'))->get();

        return CommentResource::collection($commentsQuery);
    }
}
