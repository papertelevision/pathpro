<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsPercentageCompleteVisibleToTaskGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->boolean('is_percentage_complete_visible')->default(1)->after('visibility');
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
