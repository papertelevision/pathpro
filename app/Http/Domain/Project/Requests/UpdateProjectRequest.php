<?php

namespace App\Http\Domain\Project\Requests;

use App\Domain\Project\Enums\ProjectDateFormatEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
            'title' => 'required',
            'date_format' => [
                'required',
                Rule::in([
                    ProjectDateFormatEnum::US->value,
                    ProjectDateFormatEnum::UK->value,
                    ProjectDateFormatEnum::OTHER->value
                ])
            ],
            'visibility' => 'required',
            'description' => 'required',
            'team_members' => 'array',
            'team_members.*' => 'exists:users,id',
            'is_description_public' => 'required|boolean',
            'is_public_upvoting_allowed' => 'required|boolean',
            'are_feature_submissions_allowed' => 'required|boolean',
            'accent_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ];
    }
}
