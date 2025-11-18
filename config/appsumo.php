<?php

return [
    'api_key' => env('APP_SUMO_API_KEY'),
    'client_id' => env('APP_SUMO_CLIENT_ID'),
    'redirect_uri' => env('APP_SUMO_REDIRECT_URI'),
    'client_secret' => env('APP_SUMO_CLIENT_SECRET'),
    'get_access_token_endpoint' => env('APP_SUMO_GET_ACCESS_TOKEN_ENDPOINT'),
    'get_user_license_endpoint' => env('APP_SUMO_GET_USER_LICENSE_ENDPOINT'),
    'get_license_information_endpoint' => env('APP_SUMO_GET_LICENSE_INFORMATION_ENDPOINT'),
];
