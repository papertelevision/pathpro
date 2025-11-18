<?php

namespace App\Domain\TeamMemberInvitation\Middleware;

use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use Closure;
use Illuminate\Http\Request;

class EnsureTeamMemberInvitationTokenIsValid
{
    public function handle(
        Request $request,
        Closure $next
    ) {
        $invitation = TeamMemberInvitation::where('token', $request->input('token'))->first();

        if (is_null($invitation)) {
            return response()->json(['error' => 'Invalid Token'], 401);
        }

        return $next($request);
    }
}
