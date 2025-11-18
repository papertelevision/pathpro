<?php

namespace App\Console\Commands;

use App\Domain\User\Models\User;
use Illuminate\Console\Command;

class ClearTrashedUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-trashed-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Clear the trashed users data.";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::onlyTrashed()->get();

        foreach ($users as $user) {
            $user->subscriptions()->forceDelete();
            $user->upvotes()->forceDelete();
            $user->comments()->forceDelete();
            $user->taskAndFeatureSubscriptions()->forceDelete();
            $user->projects()->forceDelete();
            $user->forceDelete();
        }

        $this->info("Trashed users data was cleared.");
    }
}
