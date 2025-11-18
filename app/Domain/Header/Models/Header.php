<?php

namespace App\Domain\Header\Models;

use App\Domain\Header\Enums\HeaderTabEnum;
use App\Domain\Project\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Header extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $casts = [
        'tabs' => 'array',
        'menu_links' => 'array',
        'custom_css' => 'array',
        'is_included' => 'boolean',
        'additional_settings' => 'object',
        'open_logo_url_in_new_tab' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getTabs(): array
    {
        return is_null($this->tabs) ? HeaderTabEnum::toArray() : $this->tabs;
    }

    public function getSubmitFeedbackButtonText(): string
    {
        return $this->additional_settings?->submit_feedback_button_text ?: 'Submit Feedback';
    }
}
