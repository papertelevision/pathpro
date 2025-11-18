<?php

namespace App\Http\Controllers;

use App\Domain\Project\Actions\AssignUserAsCommunityMemberAction;
use App\Domain\Project\Models\Project;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProjectCommunityMemberAuthController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function register(
        Request $request,
        Project $project,
        AssignUserAsCommunityMemberAction $assignUserAsCommunityMemberAction
    ) {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', Rules\Password::defaults(), 'confirmed'],
        ]);

        $communityMember = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'nickname' => $request->nickname,
            'email' => $request->email,
            'biography' => $request->biography,
            'role' => UserRoleEnum::USER,
            'password' => Hash::make($request->password),
            'api_token' => Str::random(60),
        ]);

        $communityMember
            ->addMedia(resource_path('images/user-default-img.png'))
            ->preservingOriginal()
            ->toMediaCollection('avatar');

        event(new Registered($communityMember));
        Auth::login($communityMember, true);

        $assignUserAsCommunityMemberAction->handle(
            $project,
            $communityMember
        );

        return response([
            'message' => 'success',
        ]);
    }
}
