<?php

namespace App\Http\Domain\Header\Requests;

use App\Domain\Header\Rules\ValidHeaderTab;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeaderRequest extends FormRequest
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
            'width' => 'nullable|numeric|gt:1|integer',
            'height' => 'nullable|numeric|gt:1|integer',
            'logo_url' => 'nullable|string',
            'custom_css' => 'nullable|string',
            'is_included' => 'required|boolean',
            'background_color' => 'required|string',
            'open_logo_url_in_new_tab' => 'boolean',
            'tabs' => 'array',
            'tabs.*.value' => ['required', 'string', new ValidHeaderTab],
            'tabs.*.label' => 'nullable|string',
            'tabs.*.position' => 'required|numeric|min:1|max:4',
            'menu_links' => 'nullable|array',
            'menu_links.*.url' => 'nullable|string',
            'menu_links.*.label' => 'string',
            'menu_links.*.css_class' => 'nullable|string',
            'menu_links.*.open_url_in_new_tab' => 'boolean',
            'logo' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:' . config('media-library.max_file_size'),
            'favicon' => 'nullable|file|mimes:png,jpg,jpeg,svg,ico|max:' . config('media-library.max_file_size'),
            'submit_feedback_button_text' => 'nullable|string',
            'custom_domain' => 'nullable|string',
            'is_dns_configured' => 'required|boolean',
            'accent_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ];
    }

    /**
     * Prepare inputs for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $data = [
            'is_included' => $this->toBoolean($this->is_included),
            'is_dns_configured' => $this->toBoolean($this->is_dns_configured),
            'open_logo_url_in_new_tab' => $this->toBoolean($this->open_logo_url_in_new_tab),
        ];

        $data['menu_links'] = $this->menu_links
            ? array_map(function ($value) {
                $value['open_url_in_new_tab'] = $this->toBoolean($value['open_url_in_new_tab']);
                return $value;
            }, $this->menu_links)
            : NULL;

        $this->merge($data);
    }

    /**
     * Convert to boolean
     *
     * @param $booleable
     * @return boolean
     */
    private function toBoolean($booleable)
    {
        return filter_var($booleable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}
