<?php

namespace App\Domain\Submission\Enums;

enum SubmissionStatusEnum: string
{
    case NEW = 'new';
    case DELETED = 'deleted';
    case DENIED = 'denied';
    case HIGHLIGHTED = 'highlighted';
    case VOTING = 'voting';
    case ROADMAP = 'roadmap';

    public static function normalize(string $status)
    {
        return ucfirst(strtolower($status));
    }

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::NEW => 'New',
            self::DELETED => 'Deleted',
            self::DENIED => 'Denied',
            self::HIGHLIGHTED => 'Highlighted',
            self::VOTING => 'Voting',
            self::ROADMAP => 'Roadmap',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function valuesWithLabels(): array
    {
        return array_map(function ($enum) {
            return [
                'id' => $enum->value,
                'value' => $enum->value,
                'label' => $enum->label(),
            ];
        }, self::cases());
    }
}
