<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;

class ProjectNewsAuthorController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \App\Domain\Project\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Project $project)
    {
        $newsAuthors = User::whereHas('news', function ($q) use ($project) {
            $q->where('project_id', $project->id);
        })->get();

        return UserResource::collection($newsAuthors);
    }
}
