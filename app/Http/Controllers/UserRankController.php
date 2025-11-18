<?php

namespace App\Http\Controllers;

use App\Domain\User\Enums\UserRankEnum;
use App\Http\Resources\EnumResource;

class UserRankController extends Controller
{
    /**
     * Get all of the user ranks.
     *
     */
    public function index()
    {
        return EnumResource::collection(
            UserRankEnum::valuesWithLabels()
        );
    }
}
