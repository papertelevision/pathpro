<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOnDeleteToForeignIdColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['user_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('task_groups', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['task_group_id']);
            $table->dropForeign(['release_note_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('task_group_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('release_note_id')->references('id')->on('release_notes')->onDelete('cascade');
        });

        Schema::table('task_community_members', function (Blueprint $table) {
            $table->dropForeign(['task_id']);
            $table->dropForeign(['user_id']);
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('feature_groups', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        Schema::table('features', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['feature_group_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('feature_group_id')->references('id')->on('feature_groups')->onDelete('cascade');
        });

        Schema::table('feature_user', function (Blueprint $table) {
            $table->dropForeign(['feature_id']);
            $table->dropForeign(['user_id']);
            $table->foreign('feature_id')->references('id')->on('features')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('release_notes', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['author_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('news', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['author_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['author_id']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('foreign_id_columns', function (Blueprint $table) {
            //
        });
    }
}
