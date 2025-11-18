<?php

namespace App\Http\Controllers;

use App\Http\Resources\PagesSettingsResource;
use App\Settings\PagesSettings;

class PagesSettingsController extends Controller
{
    public function show()
    {
        return PagesSettingsResource::make(app(PagesSettings::class)->getSettings());
    }
}
