<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use Illuminate\Http\Request;

class ProjectReleaseNoteAuthorController extends Controller
{
    public function __invoke(
        Request $request,
        Project $project
    ) {
        $releaseNotesAuthors = collect();
        if (
            auth()->check() &&
            !$project->communityMembers->contains($request->user())
        ) {
            $releaseNotesAuthors = User::whereHas('releaseNotes', function ($q) use ($project) {
                $q->where('project_id', $project->id);
            })->get();
        }

        return UserResource::collection($releaseNotesAuthors);
    }
}
