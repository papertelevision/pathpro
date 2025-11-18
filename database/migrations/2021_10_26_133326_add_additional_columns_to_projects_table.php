<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalColumnsToProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->after('visibility', function ($table) {
                $table->boolean('is_membership_for_community_involment_required')->default(0);
                $table->boolean('are_feature_submissions_allowed')->default(0);
                $table->boolean('are_non_subscribers_allowed_to_subscribe_to_updates')->default(0);
                $table->boolean('are_non_subscribers_allowed_to_share_on_social_media')->default(0);
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
        Schema::table('projects', function (Blueprint $table) {
            //
        });
    }
}
