<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Models\Plan;
use App\Domain\Stripe\Actions\CreateStripeSubscriptionAction;
use App\Http\Resources\StripeProductResource;
use Illuminate\Http\Request;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Domain\Stripe\Requests\PurchaseStripeProductRequest;
use App\Notifications\AccountCreatedNotification;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Stripe\Exception\InvalidRequestException;

class StripeProductController extends Controller
{
    public function index()
    {
        return StripeProductResource::collection(Plan::stripe()->get());
    }

    public function show(
        Plan $plan
    ) {
        return StripeProductResource::make($plan);
    }

    public function register(
        Request $request,
        CreateStripeSubscriptionAction $createStripeSubscriptionAction
    ) {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', Rules\Password::defaults(), 'confirmed'],
            'is_monthly_subscription' => 'required|boolean'
        ]);

        DB::beginTransaction();

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'nickname' => $request->nickname,
            'email' => $request->email,
            'biography' => $request->biography,
            'role' => UserRoleEnum::USER,
            'password' => Hash::make($request->password),
            'api_token' => Str::random(60),
        ]);

        $user
            ->addMedia(resource_path('images/user-default-img.png'))
            ->preservingOriginal()
            ->toMediaCollection('avatar');

        event(new Registered($user));
        Auth::login($user, true);

        try {
            $createStripeSubscriptionAction->handle(
                $user,
                Plan::stripe()->free()->first(),
                $request->input('is_monthly_subscription')
            );

            DB::commit();

            Notification::send(
                User::where('role', UserRoleEnum::SUPER_ADMIN)->first(),
                new AccountCreatedNotification($user)
            );

            return response([
                'message' => 'success',
            ]);
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

    public function purchase(
        PurchaseStripeProductRequest $request,
        Plan $plan,
        CreateStripeSubscriptionAction $createStripeSubscriptionAction,
    ) {
        $validated = $request->validated();
        $user = $request->user();

        if ($request->user()->cannot('purchaseStripePlan', [Plan::class, $plan])) {
            abort(403, 'You do not meet the requirements for purchasing the selected Plan.');
        }

        try {
            DB::beginTransaction();

            if ($user->hasPlan()) {
                $user->subscription('default')->cancelNow();
                $user->plan()->delete();
            }

            $createStripeSubscriptionAction->handle(
                $user,
                $plan,
                $validated['is_monthly_subscription'],
                $validated['payment_method']['id'],
                $validated['coupon']
            );

            $user->updateStripeCustomer([
                'name' => $validated['billable_name'],
                'address' => [
                    'line1' => $validated['billable_address']
                ]
            ]);

            DB::commit();

            return response([
                'message' => 'success',
            ]);
        } catch (InvalidRequestException $e) {
            DB::rollBack();

            return response([
                'message' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {
            DB::rollBack();

            return response([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
