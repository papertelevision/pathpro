<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Domain\Stripe\Requests\UpdateStripeCustomerRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\InvalidRequestException;

class StripeCustomerController extends Controller
{
    public function update(
        UpdateStripeCustomerRequest $request,
    ) {
        $validated = $request->validated();
        $customer = $request->user();

        try {
            $customer->updateStripeCustomer([
                'name' => $validated['billable_name'],
                'address' => [
                    'line1' => $validated['billable_address']
                ]
            ]);

            $customer->deletePaymentMethods();

            $paymentMethod = $customer->addPaymentMethod(
                $validated['payment_method']['id']
            );
            $customer->updateDefaultPaymentMethod($paymentMethod->id);

            DB::commit();

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
}
