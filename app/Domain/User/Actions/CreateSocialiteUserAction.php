<?php

namespace App\Domain\User\Actions;

use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\MediaLibrary\MediaCollections\Exceptions\UnreachableUrl;

class CreateSocialiteUserAction
{
    public function handle(object $socialiteUser, string $driver)
    {
        $username = $socialiteUser->name;
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $username = $socialiteUser->name . $counter;
            $counter++;
        }

        $newUser = User::create([
            'username' => $username,
            'name' => $socialiteUser->name,
            'email' => $socialiteUser->email,
            'role' => UserRoleEnum::USER,
            'password' => Hash::make(str()->password()),
            'api_token' => str()->random(60),
            'social_id' => $socialiteUser->id,
            'social_type' => $driver,
        ]);

        try {
            $avatar = $driver == 'facebook'
                ? $socialiteUser->avatar_original . "&access_token={$socialiteUser->token}"
                : $socialiteUser->avatar;

            $newUser
                ->addMediaFromUrl($avatar)
                ->toMediaCollection('avatar');
        } catch (
            UnreachableUrl $e
        ) {
        }

        return $newUser;
    }
}
