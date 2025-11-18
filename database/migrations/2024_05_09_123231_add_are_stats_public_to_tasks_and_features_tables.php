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
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('are_stats_public')->default(true)->after('are_team_members_visible');
        });

        Schema::table('features', function (Blueprint $table) {
            $table->boolean('are_stats_public')->default(true)->after('is_task_confirmed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('are_stats_public');
        });

        Schema::table('features', function (Blueprint $table) {
            $table->dropColumn('are_stats_public');
        });
    }
};
