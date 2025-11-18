<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Enums\PlanTypeEnum;
use App\Domain\Plan\Models\Plan;
use App\Domain\Plan\Models\PlanUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AppSumoController extends Controller
{
    public function __invoke(Request $request)
    {
        $isValid = $this->validateRequest($request);

        if (! $isValid) abort(401, 'Invalid signature.');

        Log::channel('appsumo')
            ->info('Incoming Webhook.', [
                'request_data' => $request->all(),
            ]);

        if ($request->event == 'upgrade' || $request->event == 'downgrade') {
            $prevPlan = PlanUser::lifetime()
                ->where('provider_payload->license_key', $request->prev_license_key)
                ->first();

            $newPlan = Plan::appsumo()
                ->where('provider_payload->tier', $request->tier)
                ->first();

            $appsumo = app('appsumo');
            $licenseInfo = $appsumo->getLicenseInformation($request->license_key);

            $prevPlan->user->plan()->create([
                'type' => PlanTypeEnum::LIFETIME,
                'plan_id' => $newPlan->id,
                'provider_payload' => $licenseInfo
            ]);

            $prevPlan->delete();
        }

        if ($request->event == 'deactivate') {
            PlanUser::lifetime()
                ->where('provider_payload->license_key', $request->license_key)
                ->delete();
        }

        return response([
            'event' => $request->input('event'),
            'success' => true,
        ]);
    }

    protected function validateRequest(Request $request): bool
    {
        $apiKey = config('appsumo.api_key');

        $timestamp = $request->header('X-Appsumo-Timestamp');
        $sha = $request->header('X-Appsumo-Signature');

        $body = $request->getContent();

        $message = "$timestamp$body";

        $signature = hash_hmac('sha256', $message, $apiKey);

        return $signature === $sha;
    }
}
