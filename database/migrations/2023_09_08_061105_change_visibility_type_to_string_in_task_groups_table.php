<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('task_groups', function ($table) {
            $table->dropColumn('visibility');
        });

        Schema::table('task_groups', function ($table) {
            $table->string('visibility')->after('header_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('task_groups', function ($table) {
            $table->dropColumn('visibility');
        });

        Schema::table('task_groups', function ($table) {
            $table->enum('visibility', ['public', 'subscribers', 'team'])->after('header_color');
        });
    }
};
