<?php

namespace App\Http\Middleware;

use App\Domain\Project\Models\Project;
use Closure;
use Illuminate\Http\Request;

class RedirectToCustomDomain
{
    public function handle(Request $request, Closure $next)
    {
        if (
            ! $request->hasHeader('apx-incoming-host')
            && $projectSlug = $request->project
        ) {
            $project = Project::where('slug', $projectSlug)->first();

            if ($project && $project->isCustomDomainConfigured() && isPublicPage($request)) {
                return redirect()->to("https://{$project->custom_domain}");
            }
        }

        return $next($request);
    }
}
