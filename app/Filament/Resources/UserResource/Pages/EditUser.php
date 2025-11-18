<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Domain\User\Enums\UserRoleEnum;
use App\Filament\Resources\UserResource;
use Filament\Actions\Action;
use Filament\Actions\ForceDeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Password;
use Illuminate\Contracts\Auth\PasswordBroker;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['role'])) {
            $data['role'] = $data['role'] ? UserRoleEnum::SUPER_ADMIN : UserRoleEnum::USER;
        }

        return $data;
    }

    protected function getActions(): array
    {
        return [
            Action::make('edit')
                ->label('Send Password Reset Link')
                ->link()
                ->requiresConfirmation()
                ->action(function ($record) {
                    $status = $this->broker()->sendResetLink([
                        'email' => $record->email
                    ]);

                    $notificationType = $status == Password::RESET_LINK_SENT ? 'success' : 'danger';
                    $notificationTitle = $status == Password::RESET_LINK_SENT
                        ? 'Password reset link sent successfully.'
                        : 'Failed to send the password reset link.';
                    $notificationIcon = $status == Password::RESET_LINK_SENT
                        ? 'heroicon-o-check'
                        : 'heroicon-o-exclamation-circle';

                    return Notification::make()
                        ->$notificationType()
                        ->title($notificationTitle)
                        ->icon($notificationIcon)
                        ->send();
                })
                ->successNotificationTitle('Password reset link sent successfully.')
                ->failureNotificationTitle('Failed to send the password reset link.'),
            ForceDeleteAction::make()
                ->before(function ($record) {
                    if ($record->subscribed('default')) {
                        $record->subscription('default')->cancelNow();
                        $record->plan()->delete();
                    }
                    $record->subscriptions()->forceDelete();
                    $record->upvotes()->forceDelete();
                    $record->comments()->forceDelete();
                    $record->taskAndFeatureSubscriptions()->forceDelete();
                    $record->projects()->forceDelete();
                })
                ->label('Delete')
                ->visible(true)
                ->hidden((fn($record) => $record->id === auth()->id()))
                ->successNotificationTitle('The user has been deleted successfully.'),
        ];
    }

    protected function broker(): PasswordBroker
    {
        return Password::broker(config('fortify.passwords'));
    }
}
