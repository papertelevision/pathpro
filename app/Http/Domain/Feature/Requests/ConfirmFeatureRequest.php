<?php

namespace App\Http\Domain\Feature\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmFeatureRequest extends FormRequest
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
            'add_to_roadmap' => 'required|boolean',
            'task_group_id' => 'required_if:add_to_roadmap,true|exists:task_groups,id',
        ];
    }
}
