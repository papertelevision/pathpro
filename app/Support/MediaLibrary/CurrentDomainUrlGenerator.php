<?php

namespace App\Support\MediaLibrary;

use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

class CurrentDomainUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        $url = parent::getUrl();

        // Get the current request URL
        $currentUrl = request()->url();

        // Parse both URLs
        $urlParts = parse_url($url);
        $currentParts = parse_url($currentUrl);

        // Replace the host in the media URL with the current host
        if (isset($currentParts['host']) && isset($urlParts['host'])) {
            $url = str_replace($urlParts['host'], $currentParts['host'], $url);
        }

        return $url;
    }
}
