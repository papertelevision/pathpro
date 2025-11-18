<?php

namespace App\Domain\Project\Enums;

enum ProjectUserPermissionEnum: string
{
    case CAN_CREATE_EDIT_TASKS_FEATURES = 'can-create-edit-tasks-features';
    case CAN_CREATE_EDIT_TASK_GROUPS = 'can-create-edit-task-groups';
    case CAN_PIN_COMMENTS = 'can-pin-comments';
    case CAN_EDIT_CUSTOM_HEADER = 'can-edit-custom-header';
    case CAN_DELETE_COMMENTS = 'can-delete-comments';
    case CAN_EDIT_PRODUCT_NEWS = 'can-edit-product-news';
    case CAN_UPDATE_RELEASE_NOTES = 'can-update-release-notes';
    case CAN_ADOPT_SUBMISSIONS = 'can-adopt-submissions';

    public function label(): string
    {
        return static::getLabel($this);
    }

    public static function getLabel(self $value): string
    {
        return match ($value) {
            self::CAN_CREATE_EDIT_TASKS_FEATURES => 'Can Create & Edit Tasks',
            self::CAN_CREATE_EDIT_TASK_GROUPS => 'Can Create & Edit Task Groups',
            self::CAN_PIN_COMMENTS => 'Can Pin Comments',
            self::CAN_DELETE_COMMENTS => 'Can Delete Comments',
            self::CAN_EDIT_PRODUCT_NEWS => 'Can Edit News',
            self::CAN_UPDATE_RELEASE_NOTES => 'Can Update Release Notes',
            self::CAN_ADOPT_SUBMISSIONS => 'Can Adopt Submissions',
            self::CAN_EDIT_CUSTOM_HEADER => 'Can Edit Settings & Design',
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
        }, self::cases());
    }
}
