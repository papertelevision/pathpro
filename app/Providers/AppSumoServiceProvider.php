<?php

namespace App\Providers;

use App\Http\Clients\AppSumoClient;
use Illuminate\Support\ServiceProvider;

class AppSumoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AppSumoClient::class, function ($app) {
            $config = config('appsumo');

            return new AppSumoClient(
                $config['client_id'],
                $config['redirect_uri'],
                $config['client_secret'],
            );
        });

        $this->app->bind('appsumo', AppSumoClient::class);
    }
}
