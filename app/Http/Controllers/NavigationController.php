<?php

namespace App\Http\Controllers;

use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use RyanChandler\FilamentNavigation\Models\Navigation;

class NavigationController extends Controller
{
    public function show(
        Request $request
    ) {
        $menu = Navigation::fromHandle('help-menu');

        foreach ($menu->items as $item) {
            $isTourOption = $item['data']['is_tour_option'];

            if (
                !$request->user()->hasPlan() &&
                $isTourOption
            ) {
                continue;
            }

            $data[] = [
                'label' => $item['label'],
                'value' => $isTourOption ? url(RouteServiceProvider::DASHBOARD) : $item['data']['url'],
                'type' => $isTourOption ? 'is_tour_option' : $item['type'],
                'is_tour_option' => $isTourOption
            ];
        }

        return $data;
    }
}
