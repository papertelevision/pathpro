<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class ReleaseSettings extends Settings
{
    public string $version;
    public string $title;
    public string $description;

    public static function group(): string
    {
        return 'release';
    }

    public function getSettings(): array
    {
        return [
            'version' => $this->version,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}
