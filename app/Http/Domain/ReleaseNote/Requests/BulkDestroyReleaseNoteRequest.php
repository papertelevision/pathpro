<?php

namespace App\Http\Domain\ReleaseNote\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDestroyReleaseNoteRequest extends FormRequest
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
            'release_notes' => 'required|array',
            'release_notes.*' => 'required|exists:release_notes,id'
        ];
    }
}
