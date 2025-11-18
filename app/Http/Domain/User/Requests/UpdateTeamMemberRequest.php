<?php

namespace App\Http\Domain\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamMemberRequest extends FormRequest
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
            'permissions' => 'required|array',
            'permissions.*.project_id' => 'required|exists:projects,id',
            'permissions.*.permission' => 'array|nullable',
            'rank' => 'nullable|string',
            'is_rank_visible' => 'required_with:rank|boolean'
        ];
    }
}
