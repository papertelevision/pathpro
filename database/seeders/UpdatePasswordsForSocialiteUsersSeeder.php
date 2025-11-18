<?php

namespace Database\Seeders;

use App\Domain\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UpdatePasswordsForSocialiteUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('social_type', ['google', 'facebook'])->get();

        foreach ($users as $user) {
            $user->password = Hash::make(Str::password());
            $user->save();
        }
    }
}
