<?php

namespace App\Http\Domain\Submission\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdoptedSubmissionRequest extends FormRequest
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
            'adopt_to' => 'required|string',
            'task_group_id' => 'required_if:adopt_to,Roadmap|exists:task_groups,id'
        ];
    }
}
