<?php

namespace App\Domain\Project\Models;

use App\Domain\Project\Enums\ProjectUserRoleEnum;
use App\Domain\User\Enums\UserRankEnum;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    protected $table = 'project_user';

    public $timestamps = false;

    protected $casts = [
        'role' => ProjectUserRoleEnum::class,
        'rank' => UserRankEnum::class,
        'permission' => 'array',
        'is_rank_visible' => 'boolean',
        'is_joined' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeTeamMembers($query)
    {
        return $query->where('role', ProjectUserRoleEnum::teamMember);
    }

    public function scopeCommunityMembers($query)
    {
        return $query->where('role', ProjectUserRoleEnum::communityMember);
    }
}
