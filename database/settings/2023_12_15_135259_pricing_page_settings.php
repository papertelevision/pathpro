<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('pricing_page.url', '');
    }

    public function down()
    {
        $this->migrator->delete('pricing_page.url');
    }
};
