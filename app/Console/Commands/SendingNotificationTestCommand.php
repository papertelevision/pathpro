<?php

namespace App\Console\Commands;

use App\Domain\Comment\Models\Comment;
use App\Domain\Project\Models\Project;
use App\Domain\Task\Models\Task;
use App\Domain\TeamMemberInvitation\Models\TeamMemberInvitation;
use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Notifications\AccountCreatedNotification;
use App\Notifications\CommunityMemberSignupNotification;
use App\Notifications\StripeProductPurchaseNotification;
use App\Notifications\TaskCommentCreatedNotification;
use App\Notifications\TeamMemberInvitationNotification;
use App\Notifications\TransactionSuccessfulNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendingNotificationTestCommand extends Command
{
    protected $signature = 'test:send-notification {type}';

    protected $description = "Test sending a notification in dev mode.";

    public function handle()
    {
        if (!config('app.debug')) {
            return $this->error('The app is not in dev mode!');
        }

        $user = User::first();

        $type = $this->argument('type');

        if ($type === 'taskComment') {
            Notification::send(
                $user,
                new TaskCommentCreatedNotification(
                    $user,
                    Task::inRandomOrder()->first(),
                    Comment::inRandomOrder()->first()
                )
            );
        }

        if ($type === 'invitation') {
            $invitation = TeamMemberInvitation::whereHas('projects')->inRandomOrder()->first();

            if ($invitation) {
                Notification::send(
                    $invitation->user,
                    new TeamMemberInvitationNotification(
                        $invitation
                    )
                );
            }
        }

        if ($type === 'signup') {
            $project = Project::whereHas('communityMembers')->inRandomOrder()->first();

            if ($project) {
                Notification::send(
                    $project->creator,
                    new CommunityMemberSignupNotification(
                        $project->communityMembers()->inRandomOrder()->first(),
                        $project
                    )
                );
            }
        }

        if ($type === 'planPurchase') {
            $user = User::whereHas('lastSubscription')->inRandomOrder()->first();
            $stripeProduct = $user->lastSubscription->product;

            if ($stripeProduct) {
                Notification::send(
                    User::where('role', UserRoleEnum::SUPER_ADMIN)->first(),
                    new StripeProductPurchaseNotification(
                        $stripeProduct,
                        $user
                    )
                );
            }
        }

        if ($type === 'accountCreated') {
            Notification::send(
                User::where('role', UserRoleEnum::SUPER_ADMIN)->first(),
                new AccountCreatedNotification(
                    $user
                )
            );
        }

        if ($type === 'transaction') {
            $customer = User::whereNotNull('stripe_id')->first();
            $amount = 2000;

            Notification::send(
                [
                    User::where('role', UserRoleEnum::SUPER_ADMIN)->first(),
                    $customer
                ],
                new TransactionSuccessfulNotification(
                    $customer,
                    $amount
                )
            );
        }

        $this->info('The notification was sent successfully!');
    }
}
