<?php

namespace App\Http\Domain\FeatureGroup\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureGroupRequest extends FormRequest
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
            'logo' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:' . config('media-library.max_file_size'),
            'title' => 'required|string|max:255',
            'header_color' => 'required|string',
            'icon_type' => 'nullable|in:uploaded,predefined',
            'icon_identifier' => 'nullable|string|required_if:icon_type,predefined',
        ];
    }
}
