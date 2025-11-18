<?php

namespace App\Http\Domain\Subscription\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreSubscriptionRequest extends FormRequest
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
    public function rules(Request $request)
    {
        $table = $request->subscribable_type === 'task' ? 'tasks' : 'features';

        return [
            'subscribable_id' => ['required', "exists:$table,id"],
            'subscribable_type' => 'required|in:task,feature',
        ];
    }
}
