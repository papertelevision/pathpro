<?php

namespace App\Http\Controllers;

use App\Domain\Header\Models\Header;
use Illuminate\Support\Facades\Response;

class HeaderStylesController extends Controller
{
    public function __invoke(
        Header $header
    ) {
        $styles = $header->custom_css
            . ".project-header { visibility: visible; height: {$header->height}px; background-color: {$header->background_color}; }"
            . ".project-header__shell { max-width: {$header->width}px; }"
            . ".header__left-links { top: calc({$header->height}px + 50px) !important; }";

        return Response::make($styles, 200, ['Content-Type' => 'text/css']);
    }
}
