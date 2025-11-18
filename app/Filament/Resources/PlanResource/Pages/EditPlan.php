<?php

namespace App\Filament\Resources\PlanResource\Pages;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Filament\Resources\PlanResource;
use Filament\Resources\Pages\EditRecord;
use Laravel\Cashier\Cashier;

class EditPlan extends EditRecord
{
    protected static string $resource = PlanResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['features'])) {
            $data['features'] = array_map(fn($feature) => ['feature' => $feature], $data['features']);
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $provider = PlanProviderEnum::tryFrom($data['provider']);

        if (isset($data['features'])) {
            $data['features'] = array_map(fn($item) => $item['feature'], $data['features']);
        }

        if ($provider == PlanProviderEnum::STRIPE) {
            $data['provider_payload'] = $this->updateStripeProduct($data);
        }

        return $data;
    }

    protected function updateStripeProduct(array $data): array
    {
        $record = $this->record;
        $recordStripeData = $record->provider_payload;

        $stripeClient = Cashier::stripe();

        $stripeProduct = $stripeClient->products->retrieve(
            $recordStripeData['stripe_id'],
            []
        );

        $stripeProduct->update(
            $recordStripeData['stripe_id'],
            [
                'name' => $data['name'],
                'description' => strip_tags($data['description'])
            ]
        );

        if ($data['price'] !== $record->price) {
            $newPrice = $stripeClient->prices->create([
                'unit_amount' => $data['price'],
                'currency' => 'USD',
                'recurring' => ['interval' => 'month'],
                'product' => $recordStripeData['stripe_id'],
            ]);

            $stripeProduct->update(
                $recordStripeData['stripe_id'],
                ['default_price' => $newPrice]
            );

            $stripeClient->prices->update(
                $recordStripeData['stripe_monthly_price_id'],
                ['active' => false,]
            );

            $recordStripeData['stripe_monthly_price_id'] = $newPrice->id;
        }

        if (
            floatval($data['yearly_discount_percentage']) !== $record->yearly_discount_percentage ||
            $data['price'] !== $record->price
        ) {
            $currentYearlyPrice = $stripeClient->prices
                ->all([
                    'active' => true,
                    'product' => $stripeProduct->id,
                    'recurring' => [
                        'interval' => 'year'
                    ],
                    'limit' => 1
                ])
                ->first();

            $discountDecimal = $data['yearly_discount_percentage'] / 100;
            $discountedYearlyPrice = $data['price'] * 12 * (1 - $discountDecimal);
            $discountedMonthlyPrice = $discountedYearlyPrice / 12;
            $discountedMonthlyPriceRoundUp = (int) ceil($discountedMonthlyPrice / 100) * 100;
            $yearlyPrice = $discountedMonthlyPriceRoundUp * 12;

            if ($currentYearlyPrice->unit_amount !== $yearlyPrice) {
                $newYearlyPrice = $stripeClient->prices->create([
                    'unit_amount' => $yearlyPrice,
                    'currency' => 'USD',
                    'recurring' => ['interval' => 'year'],
                    'product' => $recordStripeData['stripe_id'],
                ]);

                $stripeClient->prices->update(
                    $currentYearlyPrice->id,
                    ['active' => false,]
                );

                $recordStripeData['stripe_yearly_price_id'] = $newYearlyPrice->id;
            }
        }

        return $recordStripeData;
    }
}
