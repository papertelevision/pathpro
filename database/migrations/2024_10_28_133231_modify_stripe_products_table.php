<?php

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Models\Plan;
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
        Schema::table('stripe_products', function (Blueprint $table) {
            $table->rename('plans');
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->renameColumn('monthly_price', 'price');
            $table->string('provider')->after('slug');
            $table->text('provider_payload')->nullable()->after('provider');
            $table->dropColumn('is_unlimited');
            $table->string('tech_support_type')->nullable()->change();
        });

        foreach (Plan::all() as $plan) {
            $plan->update([
                'provider' => PlanProviderEnum::STRIPE,
                'provider_payload' => [
                    'stripe_id' => $plan->stripe_id,
                    'stripe_yearly_price_id' => $plan->stripe_yearly_price_id,
                    'stripe_monthly_price_id' => $plan->stripe_monthly_price_id,
                ],
            ]);
        }

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['stripe_id', 'stripe_monthly_price_id', 'stripe_yearly_price_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->rename('stripe_products');
        });

        Schema::table('stripe_products', function (Blueprint $table) {
            $table->after('provider_payload', function ($table) {
                $table->string('stripe_id')->unique();
                $table->string('stripe_monthly_price_id');
                $table->string('stripe_yearly_price_id');
            });
            $table->dropColumn('provider_payload');
            $table->dropColumn('provider');
            $table->renameColumn('price', 'monthly_price');
            $table->boolean('is_unlimited')->default(0)->after('tech_support_type');
        });
    }
};
