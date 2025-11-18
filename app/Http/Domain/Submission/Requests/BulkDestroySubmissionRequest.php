<?php

namespace App\Http\Domain\Submission\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDestroySubmissionRequest extends FormRequest
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
            'submissions' => 'required|array',
            'submissions.*' => 'required|exists:submissions,id'
        ];
    }
}
