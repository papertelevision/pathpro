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
        Schema::create('headers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->boolean('is_included')->default(false);
            $table->smallInteger('height')->nullable();
            $table->smallInteger('width')->nullable();
            $table->string('background_color')->default('#ffffff');
            $table->string('logo_url')->nullable();
            $table->boolean('open_logo_url_in_new_tab')->default(false);
            $table->text('menu_links')->nullable();
            $table->text('custom_css')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('headers');
    }
};
