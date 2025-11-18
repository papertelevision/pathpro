<?php

namespace App\Domain\Task\Enums;

enum TaskStatusEnum: string
{
    case TRACK = 'on_track';
    case PAUSED = 'paused';
    case COMPLETE = 'complete';
    case PIPELINE = 'in_pipeline';
    case CONFIRMED = 'confirmed';
    case COMING_SOON = 'coming_soon';
    case DEVELOPMENT = 'in_development';
    case UNSPECIFIED = 'no_status_applied';
    case PENDING_FEEDBACK = 'pending';
    case NEEDS_CLARIFICATION = 'needs_clarification';

    public function label(): string
    {
        return match ($this) {
            self::TRACK => 'On Track',
            self::PAUSED => 'Paused',
            self::COMPLETE => 'Complete',
            self::PIPELINE => 'In Pipeline',
            self::CONFIRMED => 'Confirmed',
            self::COMING_SOON => 'Coming Soon',
            self::COMING_SOON => 'Coming Soon',
            self::DEVELOPMENT => 'In Development',
            self::UNSPECIFIED => 'No Status Applied',
            self::PENDING_FEEDBACK => 'Pending Feedback',
            self::NEEDS_CLARIFICATION => 'Needs Clarification',
        };
    }

    public static function labels(): array
    {
        return array_map(fn ($case) => $case->label(), self::cases());
    }
}
