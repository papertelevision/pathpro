<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReleaseSettingsResource;
use App\Settings\ReleaseSettings;

class ReleaseSettingsController extends Controller
{
    public function show()
    {
        return ReleaseSettingsResource::make(app(ReleaseSettings::class)->getSettings());
    }
}
