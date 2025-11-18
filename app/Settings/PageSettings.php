<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PagesSettings extends Settings
{
    public string $pricing_page_url;
    public string $terms_of_purchase_page_url;

    public static function group(): string
    {
        return 'pages';
    }

    public function getSettings(): array
    {
        return [
            'pricing_page_url' => $this->pricing_page_url,
            'terms_of_purchase_page_url' => $this->terms_of_purchase_page_url,
        ];
    }
}
