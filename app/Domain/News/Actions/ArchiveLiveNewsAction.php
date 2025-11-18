<?php

namespace App\Domain\News\Actions;

use App\Domain\Project\Models\Project;
use App\Domain\News\Enums\NewsStatusEnum;

class ArchiveLiveNewsAction
{
    public function handle(Project $project)
    {
        $liveNews = $project
            ->news()
            ->withStatus(NewsStatusEnum::LIVE())
            ->first();

        if ($liveNews) {
            $liveNews->update(['status' => NewsStatusEnum::ARCHIVED()]);
        }
    }
}
