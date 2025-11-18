<?php

namespace App\Http\Domain\Task\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubtaskRequest extends FormRequest
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
            'description' => 'nullable|string',
            'task_type_id' => 'required|exists:task_types,id',
            'task_status_id' => 'required|exists:task_statuses,id',
            'visibility' => 'required|string',
            'is_task_upvoting_enabled' => 'required|boolean',
            'are_comments_enabled' => 'required|boolean',
            'is_comment_upvoting_allowed' => 'required|boolean',
            'are_team_members_visible' => 'required|boolean',
            'is_creator_visible' => 'required|boolean',
            'are_stats_public' => 'required|boolean',
            'team_members' => 'array',
            'team_members.*' => 'exists:users,id',
            'community_members' => 'array',
            'community_members.*' => 'exists:users,id',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg,gif,webp,svg|max:5120',
        ];
    }
}
