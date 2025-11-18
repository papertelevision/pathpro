<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Models\Plan;
use App\Http\Controllers\Controller;
use App\Http\Resources\AuthUserStripeProductResource;
use Illuminate\Http\Request;

class AuthUserStripeProductController extends Controller
{
    public function index(
        Request $request
    ) {
        $user = $request->user();
        $products = Plan::stripe()->get();
        $subscription = $user->lastSubscription;
        $coupon = $subscription?->asStripeSubscription(['discount.coupon.applies_to'])?->discount?->coupon;

        if ($coupon) {
            $appliesTo = collect($coupon->applies_to?->products);
            $amountOff = $coupon->amount_off;
            $percentOff = $coupon->percent_off;

            foreach ($products as $product) {
                if (
                    $product->isFree() ||
                    ($appliesTo->isNotEmpty() && !$appliesTo->contains($product->stripe_id))
                ) {
                    continue;
                }

                $monthlyPrice = $product->price;
                $product->price = $percentOff
                    ? $monthlyPrice * (1 - $percentOff / 100)
                    : $monthlyPrice - $amountOff;
                $product->is_coupon_used = true;
            }
        }

        return AuthUserStripeProductResource::collection($products);
    }
}
