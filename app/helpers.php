<?php

use Illuminate\Http\Request;

if (!function_exists('to_cents')) {
    function to_cents($value)
    {
        return intval(
            strval(floatval(
                preg_replace("/[^0-9.]/", "", $value)
            ) * 100)
        );
    }
}

if (!function_exists('to_dollars')) {
    function to_dollars($value)
    {
        return sprintf(
            '%0.2f',
            preg_replace("/[^0-9]/", "", $value) / 100
        );
    }
}

if (!function_exists('isPublicPage')) {
    function isPublicPage(Request $request)
    {
        return $request->is('/')
            || $request->is('task/*')
            || $request->is('features')
            || $request->is('feature/*')
            || $request->is('release-notes')
            || $request->is('news')
            || $request->is('public-news/*')
            || $request->is('*/public-news/*');
    }
}
