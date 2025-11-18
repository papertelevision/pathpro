<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUpvotableIndexOnUpvotes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('upvotes', function (Blueprint $table) {
            $table->index(['upvotable_id', 'upvotable_type'], 'upvotable_index');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('upvotes', function (Blueprint $table) {
            $table->dropIndex(['upvotable_id', 'upvotable_type'], 'upvotable_index');
        });
    }
}
