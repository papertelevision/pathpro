<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeAuthorIdColumnToNullabeAndAddUuidColumnToUpvotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('upvotes', function (Blueprint $table) {
            $table->foreignId('author_id')->nullable()->change();
            $table->uuid('uuid')->nullable()->unique()->after('upvotable_type');
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
            $table->foreignId('author_id')->nullable(false)->change();
            $table->dropColumn('uuid');
        });
    }
}
