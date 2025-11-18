<?php

namespace App\Http\Clients;

use Illuminate\Support\Facades\Http;

class AppSumoClient
{
    public function __construct(
        public string $clientId,
        public string $redirectUri,
        public string $clientSecret,
    ) {
        //
    }

    public function getAccessToken(string $code): array
    {
        return Http::withHeaders(['Content-Type' => 'application/json'])
            ->post(config('appsumo.get_access_token_endpoint'), [
                'code' => $code,
                'client_id' => $this->clientId,
                'grant_type' => 'authorization_code',
                'redirect_uri' => $this->redirectUri,
                'client_secret' => $this->clientSecret,
            ])
            ->json();
    }

    public function getUserLicense(string $token): array
    {
        return Http::get(config('appsumo.get_user_license_endpoint') . $token)
            ->json();
    }

    public function getLicenseInformation(string $key): array
    {
        return Http::withHeaders(['X-AppSumo-Licensing-Key' => config('appsumo.api_key')])
            ->get(config('appsumo.get_license_information_endpoint') . $key)
            ->json();
    }
}
