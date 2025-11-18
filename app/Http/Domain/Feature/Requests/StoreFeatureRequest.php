<?php

namespace App\Http\Domain\Feature\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeatureRequest extends FormRequest
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
            'description' => 'required|string',
            'visibility' => 'required|string',
            'feature_type_id' => 'required|exists:feature_types,id',
            'community_members' => 'array',
            'community_members.*' => 'exists:users,id',
            'are_stats_public' => 'required|boolean',
        ];
    }
}
