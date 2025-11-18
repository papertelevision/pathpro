<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AttachmentController extends Controller
{
    /**
     * Delete a media attachment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $mediaId
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $mediaId)
    {
        $media = Media::findOrFail($mediaId);

        // Get the model that owns this media (Task or Comment)
        $model = $media->model;

        // Authorization: Only the author/creator can delete their attachments
        $user = $request->user();

        // Check if user is the creator of the task/subtask or author of the comment
        $isAuthor = false;

        if ($model instanceof \App\Domain\Task\Models\Task) {
            // For tasks, check if user is the creator
            $isAuthor = $model->creator_id === $user->id;
        } elseif ($model instanceof \App\Domain\Comment\Models\Comment) {
            // For comments, check if user is the author
            $isAuthor = $model->author_id === $user->id;
        }

        if (!$isAuthor) {
            abort(403, 'You are not authorized to delete this attachment.');
        }

        // Delete the media file
        $media->delete();

        return response([
            'message' => 'Attachment deleted successfully.',
        ]);
    }
}
