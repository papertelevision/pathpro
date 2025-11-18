<?php

namespace App\Http\Domain\TaskGroup\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskGroupRequest extends FormRequest
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
            'title' => 'required|string',
            'description' => 'nullable|string',
            'header_color' => 'required|string',
            'visibility' => 'required|string',
            'is_percentage_complete_visible' => 'required|boolean',
            'is_planned_release_date_include' => 'required|boolean',
            'planned_release_type' => 'required_if:is_planned_release_date_include,true',
            'planned_release_start_date' => 'required_if:is_planned_release_date_include,true',
            'planned_release_end_date' => 'required_if:is_planned_release_date_include,true',
            'icon_type' => 'nullable|string|in:predefined,uploaded',
            'icon_identifier' => 'nullable|string',
        ];
    }
}
