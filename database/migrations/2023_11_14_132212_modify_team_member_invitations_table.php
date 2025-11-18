<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('team_member_invitations', function (Blueprint $table) {
            $table->dropColumn('email');
            $table->dropColumn('projects_data');
            $table->foreignId('user_id')->after('id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_member_invitations', function (Blueprint $table) {
            $table->string('email');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
