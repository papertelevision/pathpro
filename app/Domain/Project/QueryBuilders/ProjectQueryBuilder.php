<?php

namespace App\Domain\Project\QueryBuilders;

use App\Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;

class ProjectQueryBuilder extends Builder
{
    /**
     * Scope a query to search for a given user permission.
     *
     * @param  \App\Domain\User\Models\User $user
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function searchUserPermission(User $user, $permission): self
    {
        return $this
            ->whereHas('teamMembers', function ($query) use ($user, $permission) {
                $query->where([
                    ['user_id', $user->id],
                    ['permission', 'LIKE',  '%' . $permission . '%'],
                ]);
            });
    }
}
