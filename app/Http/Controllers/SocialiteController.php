<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Actions\CreateAppSumoPlanForUserAction;
use App\Domain\Plan\Models\Plan;
use App\Domain\Stripe\Actions\CreateStripeSubscriptionAction;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\TeamMemberInvitation\Actions\DestroyTeamMemberInvitationAction;
use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Actions\CreateSocialiteUserAction;
use App\Domain\User\Actions\GetRedirectUrlAction;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Stripe\Exception\InvalidRequestException;

class SocialiteController extends Controller
{
    public function redirect(
        Request $request
    ) {
        $driver = $request->driver;

        $state = 'redirectTo=' . ($request->input('redirectTo') ? $request->input('redirectTo') : url()->previous());
        $state .= $request->input('action') ? '&action=' . $request->input('action') : '';
        $state .= '&driver=' . $driver;

        if ($request->input('action') == 'appsumo') {
            $queryString = parse_url($request->server('HTTP_REFERER'), PHP_URL_QUERY);
            parse_str($queryString, $params);
            $code = $params['code'] ?? null;
            if ($code) {
                $state .= '&code=' . $code;
            }
        }

        return response()->json([
            'url' => view()->shared('projectSlug')
                ? null
                : Socialite::driver($driver)->with(['state' => $state])->redirect()->getTargetUrl()
        ]);
    }

    public function callback(
        Request $request,
        GetRedirectUrlAction $getRedirectUrlAction,
        DestroyTeamMemberInvitationAction $destroyTeamMemberInvitationAction,
        CreateStripeSubscriptionAction $createStripeSubscriptionAction,
        CreateAppSumoPlanForUserAction $createAppSumoPlanForUserAction,
        CreateSocialiteUserAction $createSocialiteUserAction,
    ) {
        parse_str($request->input('state'), $state);
        $redirectTo = parse_url($state['redirectTo'])['path'];
        $driver = $state['driver'];

        $socialiteUser = Socialite::driver($driver)->stateless()->user();
        $existingUser = User::withTrashed()
            ->where('social_id', $socialiteUser->id)
            ->orWhere('email', $socialiteUser->email)
            ->first();

        if (isset($state['action']) && $state['action'] === 'appsumo') {
            return $createAppSumoPlanForUserAction->handle($state['code'], $driver);
        }

        if (
            !is_null($existingUser) &&
            !is_null($existingUser?->deleted_at)
        ) {
            $existingUser->restore();
        }

        if ($existingUser) {
            if (is_null($existingUser->social_id)) {
                $existingUser->update([
                    'role' => UserRoleEnum::USER,
                    'social_id' => $socialiteUser->id,
                    'social_type' => $driver,
                ]);
            }
            auth()->login($existingUser, true);
        } else {
            $user = $createSocialiteUserAction->handle($socialiteUser, $driver);
            auth()->login($user, true);
        }

        /** @var User $authUser */
        $authUser = auth()->user();

        $plan = Plan::stripe()->free()->first();

        if (
            isset($state['action']) &&
            !$authUser->hasPlan() &&
            $authUser->can('create', [StripeSubscription::class, $plan])
        ) {
            DB::beginTransaction();
            try {
                $createStripeSubscriptionAction->handle(
                    $authUser,
                    $plan,
                    $state['action'] === 'monthly',
                );
                $redirectTo = parse_url(
                    url(route(
                        'stripe-product.billing',
                        ['plan' => Plan::where('slug', $redirectTo)->first(),],
                        false
                    )),
                    PHP_URL_PATH
                ) . '?subscription-type=' . $state['action'];
                DB::commit();
            } catch (InvalidRequestException $e) {
                DB::rollBack();
                return response([
                    'message' => $e->getMessage(),
                ], 400);
            } catch (Exception $e) {
                DB::rollBack();
                return response([
                    'message' => $e->getMessage(),
                ], 400);
            }
        }

        if (
            $redirectTo === '/team-member-invitation/register' ||
            $redirectTo === '/team-member-invitation/login'
        ) {
            if (preg_match('/\binvitation=([^&]+)/', $state['redirectTo'], $matches)) {
                $invitationId = $matches[1];
                $destroyTeamMemberInvitationAction->handle(
                    TeamMemberInvitation::find($invitationId),
                    $authUser
                );
                $redirectTo = '/login';
            }
        }

        if (
            $redirectTo === '/login'
        ) {
            $redirectTo = $getRedirectUrlAction->handle($authUser);
        }

        return redirect()->to(config('app.debug') ? env('APP_DEBUG_URL') . $redirectTo : config('app.url') . $redirectTo);
    }
}
