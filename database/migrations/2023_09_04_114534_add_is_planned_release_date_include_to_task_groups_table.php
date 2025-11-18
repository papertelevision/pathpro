<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->boolean('is_planned_release_date_include')->default(true)->after('is_percentage_complete_visible');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->dropColumn('is_planned_release_date_include');
        });
    }
};
