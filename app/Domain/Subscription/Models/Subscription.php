<?php

namespace App\Domain\Subscription\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    /**
     * Get the subscribed user.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Get the parent subscribable model.
     *
     * @return \Illuminate\Database\Eloquent\Model\Relations\MorphTo
     */
    public function subscribable()
    {
        return $this->morphTo();
    }
}
