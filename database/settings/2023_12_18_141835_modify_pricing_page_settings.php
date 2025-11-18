<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->delete('pricing_page.url', '');
        $this->migrator->add('pages.pricing_page_url', '');
        $this->migrator->add('pages.terms_of_purchase_page_url', '');
    }

    public function down(): void
    {
        $this->migrator->add('pricing_page.url', '');
        $this->migrator->delete('pages.pricing_page_url');
        $this->migrator->delete('pages.terms_of_purchase_page_url');
    }
};
