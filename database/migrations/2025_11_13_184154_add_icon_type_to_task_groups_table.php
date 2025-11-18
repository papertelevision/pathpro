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
            $table->enum('icon_type', ['uploaded', 'predefined'])->nullable();
            $table->string('icon_identifier')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->dropColumn(['icon_type', 'icon_identifier']);
        });
    }
};
