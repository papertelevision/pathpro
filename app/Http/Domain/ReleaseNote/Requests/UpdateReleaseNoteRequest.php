<?php

namespace App\Http\Domain\ReleaseNote\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReleaseNoteRequest extends FormRequest
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
            'project_id' => 'required',
            'title' => 'required',
            'description' => 'required',
            'status' => 'required',
        ];
    }
}
