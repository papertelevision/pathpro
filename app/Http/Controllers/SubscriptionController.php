<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Models\Feature;
use App\Http\Domain\Subscription\Requests\StoreSubscriptionRequest;
use App\Domain\Subscription\Models\Subscription;
use App\Domain\Task\Models\Task;

class SubscriptionController extends Controller
{
    public function store(
        StoreSubscriptionRequest $request
    ) {
        $validated = $request->validated();

        return $request->user()->taskAndFeatureSubscriptions()->create([
            'subscribable_id' => $validated['subscribable_id'],
            'subscribable_type' => $validated['subscribable_type'] === 'task'
                ? Task::class
                : Feature::class
        ]);
    }

    public function destroy(Subscription $subscription)
    {
        return $subscription->delete();
    }
}
