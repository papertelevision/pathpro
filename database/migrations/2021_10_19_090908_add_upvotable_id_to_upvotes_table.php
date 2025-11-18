<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUpvotableIdToUpvotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Split into multiple operations for SQLite compatibility
        Schema::table('upvotes', function (Blueprint $table) {
            $table->renameColumn('user_id', 'author_id');
        });
        
        Schema::table('upvotes', function (Blueprint $table) {
            $table->unsignedInteger('upvotable_id');
        });
        
        Schema::table('upvotes', function (Blueprint $table) {
            $table->renameColumn('upvoteable_type', 'upvotable_type');
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
            //
        });
    }
}
