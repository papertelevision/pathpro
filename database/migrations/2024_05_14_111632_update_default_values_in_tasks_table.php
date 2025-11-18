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
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('are_comments_enabled')->default(true)->change();
            $table->boolean('is_comment_upvoting_allowed')->default(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('are_comments_enabled')->default(false)->change();
            $table->boolean('is_comment_upvoting_allowed')->default(false)->change();
        });
    }
};
