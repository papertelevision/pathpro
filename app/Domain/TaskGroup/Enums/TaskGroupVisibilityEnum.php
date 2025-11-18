<?php

namespace App\Domain\TaskGroup\Enums;

enum TaskGroupVisibilityEnum: string
{
    case PUBLISHED = 'published';
    case DRAFT = 'draft';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::PUBLISHED => 'Published',
            self::DRAFT => 'Draft',
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
