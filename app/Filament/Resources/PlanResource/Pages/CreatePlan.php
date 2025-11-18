<?php

namespace App\Filament\Resources\PlanResource\Pages;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Filament\Resources\PlanResource;
use Filament\Resources\Pages\CreateRecord;
use Laravel\Cashier\Cashier;

class CreatePlan extends CreateRecord
{
    protected static string $resource = PlanResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['features'] = array_map(fn($item) => $item['feature'], $data['features']);

        $provider = PlanProviderEnum::tryFrom($data['provider']);

        if ($provider == PlanProviderEnum::STRIPE) {
            $data['provider_payload'] = $this->createStripeProduct($data);
        }

        return $data;
    }

    protected function createStripeProduct(array $data): array
    {
        $stripe = Cashier::stripe();

        $product = $stripe->products->create([
            'name' => $data['name'],
            'description' => strip_tags($data['description']),
            'default_price_data' => [
                'unit_amount' => $data['price'],
                'currency' => 'USD',
                'recurring' => ['interval' => 'month'],
            ]
        ]);

        $discountDecimal = $data['yearly_discount_percentage'] / 100;
        $discountedYearlyPrice = $data['price'] * 12 * (1 - $discountDecimal);
        $discountedMonthlyPrice = $discountedYearlyPrice / 12;
        $discountedMonthlyPriceRoundUp = (int) ceil($discountedMonthlyPrice / 100) * 100;

        $yearlyPrice = $stripe->prices->create([
            'product' => $product->id,
            'unit_amount' => $discountedMonthlyPriceRoundUp * 12,
            'currency' => 'USD',
            'recurring' => ['interval' => 'year'],
        ]);

        return [
            'stripe_id' => $product->id,
            'stripe_yearly_price_id' => $yearlyPrice->id,
            'stripe_monthly_price_id' => $product->default_price,
        ];
    }
}
