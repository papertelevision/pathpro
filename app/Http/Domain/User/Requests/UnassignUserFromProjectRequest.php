<?php

namespace App\Http\Domain\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnassignUserFromProjectRequest extends FormRequest
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
            'wipe_member_content' => 'required|boolean',
            'ban_member' => 'required|boolean'
        ];
    }
}
