<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Models\Plan;
use App\Domain\Stripe\Models\StripeSubscription;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\InvalidRequestException;
use App\Domain\Stripe\Actions\CreateStripeSubscriptionAction;
use App\Domain\Stripe\Actions\UpdateStripeSubscriptionAction;
use App\Http\Domain\Stripe\Requests\UpdateStripeSubscriptionRequest;

class StripeSubscriptionController extends Controller
{
    public function create(
        Request $request,
        CreateStripeSubscriptionAction $createStripeSubscriptionAction
    ) {
        $user = $request->user();
        $plan = Plan::stripe()->free()->first();

        if (
            $user &&
            !$user->isSuperAdmin() &&
            $user->can('create', [StripeSubscription::class, $plan])
        ) {
            DB::beginTransaction();
            try {
                $createStripeSubscriptionAction->handle(
                    $user,
                    $plan,
                    $request->input('subscription-type')
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

        return view('index');
    }

    public function update(
        UpdateStripeSubscriptionRequest $request,
        Plan $plan,
        UpdateStripeSubscriptionAction $updateStripeSubscriptionAction
    ) {
        $validated = $request->validated();
        $authUser = $request->user();

        if ($authUser->cannot('update', [StripeSubscription::class, $plan])) {
            abort(403, 'You do not meet the requirements for purchasing the selected Plan.');
        }

        try {
            DB::beginTransaction();
            $updateStripeSubscriptionAction->handle(
                $authUser,
                $plan,
                $validated['isMonthly']
            );
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
