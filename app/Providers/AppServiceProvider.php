<?php

namespace App\Providers;

use App\Domain\Project\Models\Project;
use App\Domain\Stripe\Models\StripeSubscription;
use App\Domain\Stripe\Models\StripeSubscriptionItem;
use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;
use Stripe\Stripe;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Cashier::ignoreMigrations();
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Model::unguard();

        if (config('stripe.secret_key')) {
            Stripe::setApiKey(config('stripe.secret_key'));
        }

        Cashier::useCustomerModel(User::class);
        Cashier::useSubscriptionModel(StripeSubscription::class);
        Cashier::useSubscriptionItemModel(StripeSubscriptionItem::class);

        // Only attempt project lookup if not running console commands and tables exist
        try {
            // Check if we have a valid database connection and tables exist
            \DB::connection()->getPdo();
            if (\Schema::hasTable('projects')) {
                $projectSlug = strstr(request()->host(), "." . config('app.domain'), true);
                $project = Project::where('slug', $projectSlug)->first();

                View::share('projectSlug', $projectSlug);
                View::share('projectTitle', $project?->title);
                View::share('projectFavicon', $project?->header?->getFirstMediaUrl('favicon'));
                View::share('projectCustomDomainConfigured', $project?->isCustomDomainConfigured());
            } else {
                $this->setDefaultViewShares();
            }
        } catch (\Exception $e) {
            // Database connection failed or tables don't exist, use defaults
            $this->setDefaultViewShares();
        }
    }

    private function setDefaultViewShares()
    {
        View::share('projectSlug', '');
        View::share('projectTitle', 'PathPro');
        View::share('projectFavicon', '');
        View::share('projectCustomDomainConfigured', false);
    }
}
