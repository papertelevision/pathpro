<?php

namespace App\Domain\Project\Middleware;

use App\Domain\Project\Models\Project;
use Closure;
use Illuminate\Http\Request;

class EnsureProjectIsAccessible
{
    public function handle(
        Request $request,
        Closure $next,
    ) {
        $user = $request->user();
        $project = Project::where('slug', $request->project)->first();
        $isAdminPage = $request->is('community-members-members')
            || $request->is('team-members')
            || $request->is('banned-members');
        $isPrivatePage = $request->is('submissions');

        if (
            $isAdminPage &&
            $project &&
            $user?->id != $project->creator_id
        ) {
            abort(401);
        }

        if (
            $isPrivatePage &&
            $project &&
            $user &&
            !$user->assignedAsAdminOrTeamMemberToProjects->contains($project)
        ) {
            abort(401);
        }

        if ($project && $project->isPrivate()) {
            // Private projects are visible only to Admin and Team Members.
            if ($user && $user->assignedAsAdminOrTeamMemberToProjects->contains($project)) {
                return $next($request);
            }

            abort(404, 'Private project.');
        }

        if ($project && $project->isArchived()) {
            // Archived projects are visible only to Admin.
            if ($user && $user->id == $project->creator_id) {
                return $next($request);
            }

            abort(404, 'Archived project.');
        }

        return $next($request);
    }
}
