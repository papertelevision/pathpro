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
        Schema::table('tasks', function ($table) {
            $table->dropColumn('visibility');
        });

        Schema::table('tasks', function ($table) {
            $table->string('visibility')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('tasks', function ($table) {
            $table->dropColumn('visibility');
        });

        Schema::table('tasks', function ($table) {
            $table->enum('visibility', ['public', 'subscribers', 'team'])->after('description');
        });
    }
};
