<?php

namespace App\Http\Controllers;

use App\Domain\Plan\Actions\CreateAppSumoPlanForUserAction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    public function show(Request $request)
    {
        auth()->logout();

        if (! $request->code) {
            return redirect(config('stripe.app_pricing_page_url'));
        }

        return view('index');
    }

    public function store(
        Request $request,
        CreateAppSumoPlanForUserAction $createAppSumoPlanForUserAction
    ) {
        if (! $request->code) {
            return response(['message' => 'Code parameter is missing.'], 401);
        }

        $request->validate([
            'code' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => ['required', Rules\Password::defaults(), 'confirmed'],
        ]);

        return $createAppSumoPlanForUserAction->handle($request->code);
    }
}
