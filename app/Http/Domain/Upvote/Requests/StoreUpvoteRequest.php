<?php

namespace App\Http\Domain\Upvote\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpvoteRequest extends FormRequest
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
            'upvotable_id' => 'required',
            'upvotable_type' => 'required|string',
            'uuid' => 'required|nullable'
        ];
    }
}
