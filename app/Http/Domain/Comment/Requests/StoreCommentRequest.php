<?php

namespace App\Http\Domain\Comment\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
            'content' => 'required',
            'is_comment_pinned_to_top' => 'required|boolean',
            'is_comment_highlighted' => 'nullable',
            'parent_comment_id' => 'nullable',
            'commentable_id' => 'required',
            'commentable_type' => 'required|string',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg,gif,webp,svg|max:5120',
        ];
    }
}
