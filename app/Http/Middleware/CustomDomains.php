<?php

namespace App\Http\Middleware;

use App\Domain\Project\Models\Project;
use Closure;
use Illuminate\Http\Request;

class CustomDomains
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->hasHeader('apx-incoming-host')) {
            return $next($request);
        }

        $customDomain = $request->header('apx-incoming-host');

        $project = Project::where('custom_domain', $customDomain)->first();
        if (! ($project && $project->isCustomDomainConfigured())) {
            abort(404);
        }

        config([
            'session.domain' => $customDomain,
            'sanctum.stateful' => [...config('sanctum.stateful'), $customDomain],
        ]);

        $request->merge([
            'domain' => $customDomain,
        ]);

        return $next($request);
    }
}
