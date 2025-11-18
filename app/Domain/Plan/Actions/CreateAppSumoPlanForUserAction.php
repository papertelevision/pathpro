<?php

namespace App\Domain\Plan\Actions;

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\Plan\Models\PlanUser;
use App\Domain\User\Actions\CreateSocialiteUserAction;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class CreateAppSumoPlanForUserAction
{
    public function handle(
        string $code,
        ?string $driver = null
    ) {
        DB::beginTransaction();

        if ($driver) { // Google or Facebook login
            $user = $this->handleSocialiteUser($driver);
        } else if (auth()->check()) { // Login request
            $user = auth()->user();
        } else { // Register request
            $user = User::create([
                'role' => UserRoleEnum::USER,
                'email' => request()->email,
                'username' => request()->username,
                'password' => Hash::make(request()->password),
                'api_token' => str()->random(60),
            ]);

            $user->addMedia(resource_path('images/user-default-img.png'))
                ->preservingOriginal()
                ->toMediaCollection('avatar');
        }

        if ($user->hasPlan()) {
            if ($user->plan->isFree()) {
                if ($user->subscribed('default')) {
                    $user->subscription('default')->cancelNow();
                }
                $user->plan()->delete();
            } else {
                return $this->handleErrorResponse('This account already has an active paid plan.', 403, $code, $driver);
            }
        }

        $appsumo = app('appsumo');
        $accessTokenResponse = $appsumo->getAccessToken($code);
        $token = $accessTokenResponse['access_token'] ?? null;

        if (is_null($token)) {
            if (isset($accessTokenResponse['refresh_token'])) { // Try to fetch new one.
                $accessTokenResponse = $appsumo->getAccessToken($accessTokenResponse['refresh_token']);
                $token = $accessTokenResponse['access_token'] ?? null;
            }

            if (isset($accessTokenResponse['error'])) {
                return $this->handleErrorResponse($accessTokenResponse['error_description'], 401, $code, $driver);
            }
        }

        $license = $appsumo->getUserLicense($token);

        if ($license['status'] !== 'active' || !isset($license['license_key'])) {
            return $this->handleErrorResponse('Inactive license.', 401, $code, $driver);
        }

        if (PlanUser::lifetime()->where('provider_payload->license_key', $license['license_key'])->exists()) {
            return $this->handleErrorResponse('This license has already been activated.', 401, $code, $driver);
        }

        $licenseInfo = $appsumo->getLicenseInformation($license['license_key']);

        $plan = Plan::select('id')->appsumo()->where('provider_payload->tier', $licenseInfo['tier'])->first();
        $user->plan()->create([
            'type' => PlanTypeEnum::LIFETIME,
            'plan_id' => $plan->id,
            'provider_payload' => $licenseInfo
        ]);

        DB::commit();

        if (! auth()->check()) {
            auth()->login($user, true);
        }

        return $driver
            ? redirect()->to(config('app.url') . RouteServiceProvider::DASHBOARD)
            : response(['redirectTo' => RouteServiceProvider::DASHBOARD]);
    }

    protected function handleSocialiteUser(string $driver)
    {
        $socialiteUser = Socialite::driver($driver)->stateless()->user();
        $user = User::withTrashed()
            ->where('social_id', $socialiteUser->id)
            ->orWhere('email', $socialiteUser->email)
            ->first();

        if (! $user) {
            $user = (new CreateSocialiteUserAction)->handle($socialiteUser, $driver);
        }

        return $user;
    }

    protected function handleErrorResponse(string $message, int $errorCode, string $code, string|null $driver)
    {
        DB::rollBack();

        auth()->logout();

        return $driver
            ? redirect()->to(config('app.url') . '/register?code=' . $code . '&error=' . $message)
            : response(['message' => $message], $errorCode);
    }
}
