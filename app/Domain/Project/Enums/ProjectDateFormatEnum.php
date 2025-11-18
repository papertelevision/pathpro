<?php

namespace App\Domain\Project\Enums;

enum ProjectDateFormatEnum: string
{
    case US = 'us';
    case UK = 'uk';
    case OTHER = 'other';
}
