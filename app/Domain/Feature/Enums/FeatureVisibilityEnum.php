<?php

namespace App\Domain\Feature\Enums;

enum FeatureVisibilityEnum: string
{
    case PUBLIC = 'public';
    case DRAFT = 'draft';

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::PUBLIC => 'Public',
            self::DRAFT => 'Draft',
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
