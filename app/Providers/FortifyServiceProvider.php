<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Domain\Plan\Models\Plan;
use App\Domain\Stripe\Actions\CreateStripeSubscriptionAction;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\User\Actions\GetRedirectUrlAction;
use Exception;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Fortify;
use Stripe\Exception\InvalidRequestException;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->instance(LoginResponse::class, new class implements LoginResponse
        {
            public function toResponse($request)
            {
                $authUser = $request->user();
                $stripeProduct = $request->input('stripeProduct');
                $freeStripeProduct = Plan::stripe()->free()->first();
                $isMonthlySubscription = $request->input('isMonthlySubscription');

                if (
                    $stripeProduct &&
                    !$authUser->hasPlan() &&
                    $authUser->can('create', [StripeSubscription::class, $freeStripeProduct])
                ) {
                    DB::beginTransaction();
                    try {
                        (new CreateStripeSubscriptionAction)->handle(
                            auth()->user(),
                            $freeStripeProduct,
                            $isMonthlySubscription
                        );
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

                return response()->json([
                    'redirectTo' => (new GetRedirectUrlAction)->handle($authUser, $stripeProduct, $isMonthlySubscription)
                ]);
            }
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::requestPasswordResetLinkView(function () {
            return redirect()->route('login');
        });

        Fortify::resetPasswordView(function ($request) {
            return redirect()->route('create-new-password', $request->email);
        });

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->email . $request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
