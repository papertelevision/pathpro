<?php

namespace App\Http\Domain\Stripe\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStripeCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'billable_name' => 'required|string',
            'billable_address' => 'required|string',
            'payment_method' => 'required|array',
            'payment_method.id' => 'required|string',
        ];
    }
}
