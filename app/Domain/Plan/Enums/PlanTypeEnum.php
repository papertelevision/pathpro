<?php

namespace App\Domain\Plan\Enums;

enum PlanTypeEnum: string
{
    case LIFETIME = 'lifetime';
    case SUBSCRIPTION = 'subscription';
}
