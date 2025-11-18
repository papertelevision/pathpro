<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('projects')
            ->where('visibility', 'draft')
            ->update(['visibility' => 'archived']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('projects')
            ->where('visibility', 'archived')
            ->update(['visibility' => 'draft']);
    }
};
