<?php

namespace App\Http\Domain\Project\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDestroyMemberRequest extends FormRequest
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
            'wipe_members_content' => 'required|boolean',
            'ban_members' => 'required|boolean',
            'members' => 'required|array',
            'members.*' => 'required|exists:users,id'
        ];
    }
}
