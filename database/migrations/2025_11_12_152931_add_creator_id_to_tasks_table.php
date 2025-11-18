<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('creator_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->nullOnDelete();
        });

        // Populate creator_id for existing tasks
        // Set creator to the first team member, or the project admin if no team members
        DB::statement("
            UPDATE tasks t
            LEFT JOIN (
                SELECT task_id, MIN(user_id) as first_user_id
                FROM task_user
                GROUP BY task_id
            ) tu ON t.id = tu.task_id
            LEFT JOIN project_user pu ON t.project_id = pu.project_id AND pu.role = 'admin'
            SET t.creator_id = COALESCE(tu.first_user_id, pu.user_id)
            WHERE t.creator_id IS NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['creator_id']);
            $table->dropColumn('creator_id');
        });
    }
};
