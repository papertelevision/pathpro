<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalColumnsToTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('task_type_id')->references('id')->on('task_types');
            $table->foreign('task_status_id')->references('id')->on('task_statuses');

            $table->after('task_status_id', function ($table) {
                $table->boolean('is_task_upvoting_enabled')->default(0);
                $table->boolean('are_comments_enabled')->default(0);
                $table->boolean('is_comment_upvoting_allowed')->default(0);
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            //
        });
    }
}
