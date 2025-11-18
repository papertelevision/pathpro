<?php

namespace App\Domain\Header\Enums;

enum HeaderTabEnum: string
{
    case FEATURE_VOTING = 'featureVoting';
    case ROADMAP = 'roadmap';
    case RELEASE_NOTES = 'releaseNotes';
    case PROJECT_NEWS = 'projectNews';

    public function label(): string
    {
        return self::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::FEATURE_VOTING => 'Feature Voting',
            self::ROADMAP => 'Roadmap',
            self::RELEASE_NOTES => 'Release Notes',
            self::PROJECT_NEWS => 'Project News',
        };
    }

    public function position(): int
    {
        return match ($this) {
            HeaderTabEnum::FEATURE_VOTING => 1,
            HeaderTabEnum::ROADMAP => 2,
            HeaderTabEnum::RELEASE_NOTES => 3,
            HeaderTabEnum::PROJECT_NEWS => 4,
        };
    }

    public static function toArray(): array
    {
        return array_map(function ($enum) {
            return [
                'value' => $enum->value,
                'label' => $enum->label(),
                'position' => $enum->position(),
                'is_default' => true,
            ];
        }, self::cases());
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
