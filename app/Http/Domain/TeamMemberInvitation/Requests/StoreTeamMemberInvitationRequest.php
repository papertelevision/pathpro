<?php

namespace App\Http\Domain\TeamMemberInvitation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamMemberInvitationRequest extends FormRequest
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
        $user = $this->user();

        return [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($user) {
                    if ($value === $user->email) {
                        $fail('The email must be different from your own email.');
                    }
                },
            ],
            'projects' => 'required|array',
            'projects.*' => 'required|exists:projects,id',
        ];
    }
}
