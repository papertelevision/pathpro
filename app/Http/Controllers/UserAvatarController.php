<?php

namespace App\Http\Controllers;

use App\Domain\User\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserAvatarController extends Controller
{
    public function update(
        User $user,
        Request $request
    ) {
        $user->when(
            $request->hasFile('avatar') &&
                $request->file('avatar')->isValid(),
            function () use ($user) {
                $user->clearMediaCollection('avatar');
                $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
            }
        );

        return new UserResource($user->load([
            'media',
            'submissions',
            'adoptedSubmissions',
            'permissions'
        ]));
    }
}
