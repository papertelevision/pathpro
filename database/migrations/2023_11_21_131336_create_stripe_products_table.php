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
        Schema::create('stripe_products', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('name');
            $table->text('description');
            $table->string('stripe_id')->unique();
            $table->string('stripe_monthly_price_id');
            $table->integer('monthly_price');
            $table->string('stripe_yearly_price_id');
            $table->float('yearly_discount_percentage', 7, 5);
            $table->integer('projects_count')->nullable();
            $table->integer('community_members_count')->nullable();
            $table->integer('team_members_count')->nullable();
            $table->string('tech_support_type');
            $table->boolean('is_unlimited')->default(0);
            $table->boolean('is_recommended')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stripe_products');
    }
};
