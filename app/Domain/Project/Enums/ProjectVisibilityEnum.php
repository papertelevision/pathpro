<?php

namespace App\Domain\Project\Enums;

enum ProjectVisibilityEnum: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::PUBLIC => 'Public',
            self::PRIVATE => 'Private/Internal',
            self::ARCHIVED => 'Archived',
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
