<?php

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\PlanUser;
use App\Domain\Stripe\Models\StripeSubscription;
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
        Schema::create('plan_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('plan_id')->references('id')->on('plans')->onDelete('cascade');
            $table->string('type');
            $table->text('provider_payload')->nullable();
            $table->timestamps();
        });

        $subscriptions = StripeSubscription::where('stripe_status', 'active')->get();
        foreach ($subscriptions as $subscription) {
            PlanUser::create([
                'type' => PlanTypeEnum::SUBSCRIPTION,
                'user_id' => $subscription->user_id,
                'plan_id' => $subscription->product->id,
                'provider_payload' => [
                    'subscription_id' => $subscription->id,
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_users');
    }
};
