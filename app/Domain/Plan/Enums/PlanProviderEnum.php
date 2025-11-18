<?php

namespace App\Domain\Plan\Enums;

enum PlanProviderEnum: string
{
    case STRIPE = 'stripe';
    case APPSUMO = 'appsumo';

    public static function toArray(): array
    {
        return [
            self::STRIPE->value => ucfirst(self::STRIPE->value),
            self::APPSUMO->value => ucfirst(self::APPSUMO->value),
        ];
    }
}
