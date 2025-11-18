<?php

use App\Domain\Header\Models\Header;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (Header::whereNotNull('tabs')->get() as $header) {
            $tabs = $header->tabs;

            $tabs = array_map(function ($tab) {
                if ($tab['value'] == 'productPath') {
                    $tab['value'] = 'roadmap';
                    $tab['label'] = $tab['is_default'] ? 'Roadmap' : $tab['label'];
                }

                return $tab;
            }, $tabs);

            $header->update(['tabs' => $tabs]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (Header::whereNotNull('tabs')->get() as $header) {
            $tabs = $header->tabs;

            $tabs = array_map(function ($tab) {
                if ($tab['value'] == 'roadmap') {
                    $tab['value'] = 'productPath';
                    $tab['label'] = $tab['is_default'] ? 'Product Path' : $tab['label'];
                }

                return $tab;
            }, $tabs);

            $header->update(['tabs' => $tabs]);
        }
    }
};
