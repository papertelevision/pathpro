<?php

namespace App\Domain\Project\Enums;

enum ProjectUserRoleEnum: string
{
    case admin = 'Admin';
    case teamMember = 'Team Member';
    case communityMember = 'Community Member';

    public static function normalize(string $status)
    {
        return ucfirst(strtolower($status));
    }

    public function rank(): int
    {
        return match ($this) {
            ProjectUserRoleEnum::admin => 3,
            ProjectUserRoleEnum::teamMember => 2,
            ProjectUserRoleEnum::communityMember => 1,
        };
    }
}
