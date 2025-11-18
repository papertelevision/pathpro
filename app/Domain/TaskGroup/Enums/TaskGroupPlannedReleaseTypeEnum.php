<?php

namespace App\Domain\TaskGroup\Enums;

use Spatie\Enum\Laravel\Enum;

/**
 * @method static self singleDate()
 * @method static self dateRange()
 */
class TaskGroupPlannedReleaseTypeEnum extends Enum
{
    protected static function labels(): array
    {
        return [
            'singleDate' => 'Single Date',
            'dateRange' => 'Date Range',
        ];
    }
}
