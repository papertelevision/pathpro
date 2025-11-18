<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class FallbackController extends Controller
{
    public function __invoke(Request $request)
    {
        $isPublicPage =
            $request->host() != config('app.domain') &&
            isPublicPage($request);

        return auth()->check() || $isPublicPage
            ? view('index')
            : redirect()->route('login');
    }
}
