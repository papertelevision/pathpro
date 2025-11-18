<?php

namespace App\Domain\User\Enums;

enum UserRoleEnum: string
{
    case SUPER_ADMIN = 'superAdmin';
    case USER = 'user';
    case INACTIVE = 'inactive';

    public static function normalize(string $status)
    {
        return ucfirst(strtolower($status));
    }
}
