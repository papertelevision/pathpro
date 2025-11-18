<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('release.version', '');
        $this->migrator->add('release.title', '');
        $this->migrator->add('release.description', '');
    }

    public function down(): void
    {
        $this->migrator->delete('release.version');
        $this->migrator->delete('release.title');
        $this->migrator->delete('release.description');
    }
};
