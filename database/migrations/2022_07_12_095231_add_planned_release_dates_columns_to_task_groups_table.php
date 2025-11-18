<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPlannedReleaseDatesColumnsToTaskGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->string('planned_release_type')->after('is_percentage_complete_visible');
            $table->timestamp('planned_release_start_date')->after('planned_release_type');
            $table->timestamp('planned_release_end_date')->after('planned_release_start_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            //
        });
    }
}
