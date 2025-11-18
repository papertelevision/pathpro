<?php

namespace App\Domain\User\Enums;

enum UserRankEnum: string
{
    case COMMUNITY_MEMBER = 'communityMember';
    case VERIFIED_CUSTOMER = 'verifiedCustomer';
    case CONTRIBUTOR = 'contributor';
    case ADVANCED_CONTRIBUTOR = 'advancedContributor';
    case ELITE_CONTRIBUTOR = 'eliteContributor';
    case BANNED = 'banned';
    case TEAM_MEMBER = 'teamMember';
    case LEAD_DEVELOPER = 'leadDeveloper';
    case DEVELOPER = 'developer';
    case UX_UI_Designer = 'uxUiDesigner';
    case DESIGNER = 'designer';
    case MARKETING_MANAGER = 'marketingManager';
    case PRODUCT_MANAGER = 'productManager';
    case MANAGER = 'manager';
    case WRITER = 'writer';
    case TECH_LEAD = 'techLead';
    case CUSTOMER_SUPPORT = 'customerSupport';
    case PRODUCT_PARTNER = 'productPartner';
    case BETA_TESTER = 'betaTester';

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::COMMUNITY_MEMBER => 'Community Member',
            self::VERIFIED_CUSTOMER => 'Verified Customer',
            self::CONTRIBUTOR => 'Contributor',
            self::ADVANCED_CONTRIBUTOR => 'Advanced Contributor',
            self::ELITE_CONTRIBUTOR => 'Elite Contributor',
            self::BANNED => 'Banned',
            self::TEAM_MEMBER => 'Team Member',
            self::LEAD_DEVELOPER => 'Lead Developer',
            self::DEVELOPER => 'Developer',
            self::UX_UI_Designer => 'UX/UI Designer',
            self::DESIGNER => 'Designer',
            self::MARKETING_MANAGER => 'Marketing Manager',
            self::PRODUCT_MANAGER => 'Product Manager',
            self::MANAGER => 'Manager',
            self::WRITER => 'Writer',
            self::TECH_LEAD => 'Tech Lead',
            self::CUSTOMER_SUPPORT => 'Customer Support',
            self::PRODUCT_PARTNER => 'Product Partner',
            self::BETA_TESTER => 'Beta Tester',
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
                'value' => $enum->value,
                'label' => $enum->label(),
            ];
        }, self::casesWithoutBanned());
    }

    public static function casesWithoutBanned(): array
    {
        return array_filter(self::cases(), function ($enum) {
            return $enum !== self::BANNED;
        });
    }

    public static function valueWithLabel($enum): array|null
    {
        if (is_null($enum)) return null;

        return [
            'value' => $enum->value,
            'label' => $enum->label()
        ];
    }
}
