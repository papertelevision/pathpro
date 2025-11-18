<?php

namespace App\Filament\Resources;

use App\Domain\User\Enums\UserRoleEnum;
use App\Domain\User\Models\User;
use App\Filament\Resources\UserResource\Pages\EditUser;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Filament\Resources\UserResource\Pages\ViewUser;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Cashier;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    public static function form(Form $form): Form
    {
        $formModel = $form->model;
        $stripe = Cashier::stripe();

        return $form
            ->schema([
                TextInput::make('id')
                    ->disabled(),
                TextInput::make('username')
                    ->unique(table: User::class, ignoreRecord: true)
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->unique(table: User::class, ignoreRecord: true)
                    ->required()
                    ->email()
                    ->maxLength(255),
                Checkbox::make('role')
                    ->label('Is Super Admin')
                    ->afterStateHydrated(function (Checkbox $component, $state) {
                        $component->state($state === UserRoleEnum::SUPER_ADMIN->value);
                    })
                    ->disabled(fn(Model $record) => $record->id === auth()->user()->id),
                Repeater::make('assignedToProjects')
                    ->label('Member of the Projects:')
                    ->disabled()
                    ->relationship('assignedToProjects')
                    ->itemLabel(fn(array $state): ?string => 'Project: ' . $state['title'] ?? null)
                    ->schema([
                        TextInput::make('title'),
                        TextInput::make('slug'),
                        TextInput::make('role')
                            ->label('Role')
                            ->afterStateHydrated(function (TextInput $component, Model $record) use ($formModel) {
                                if ($record->teamMembers->contains($formModel)) {
                                    return $component->state('Team Member');
                                }
                                if ($record->communityMembers->contains($formModel)) {
                                    return $component->state('Community Member');
                                }
                                if ($record->adminMembers->contains($formModel)) {
                                    return $component->state('Admin Member');
                                }
                                if ($record->bannedMembers->contains($formModel)) {
                                    return $component->state('Banned Member');
                                }
                            })
                    ])
                    ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
                        unset($data["role"]);
                        return $data;
                    })
                    ->deletable(false)
                    ->collapsible()
                    ->collapsed()
                    ->grid(2)
                    ->columns(3),
                Repeater::make('subscriptions')
                    ->label('Stripe Subscriptions:')
                    ->relationship('subscriptions')
                    ->itemLabel(fn(array $state): ?string => 'Subscription: ' . $state['name'] ?? null)
                    ->schema([
                        TextInput::make('stripe_id')
                            ->label('Id'),
                        TextInput::make('name'),
                        TextInput::make('stripe_status')
                            ->label('Status')
                            ->suffixIcon(fn($state): ?string => $state === 'active' ? 'heroicon-m-check-circle' : 'heroicon-m-exclamation-circle')
                            ->suffixIconColor(fn($state): ?string => $state === 'active' ? 'success' : 'danger'),
                        TextInput::make('stripe_price')
                            ->label('Price')
                            ->afterStateHydrated(function (TextInput $component, $state, Model $record) use ($stripe) {
                                $price = $stripe->prices->retrieve(
                                    $state,
                                    []
                                );
                                $formattedPrice = number_format($price->unit_amount / 100, 2, '.', '');
                                return $component->state($formattedPrice);
                            })
                            ->dehydrated(false)
                            ->numeric()
                            ->inputMode('decimal')
                            ->prefix('$')
                            ->suffix('USD'),
                        DateTimePicker::make('created_at')
                            ->label('Created at'),
                        DateTimePicker::make('ends_at')
                            ->label('Ends at')
                            ->hidden(fn($state): bool => (int) is_null($state))
                    ])
                    ->dehydrated(false)
                    ->mutateRelationshipDataBeforeSaveUsing(fn(array $data): array => $data)
                    ->deletable(false)
                    ->collapsible()
                    ->collapsed()
                    ->grid(2)
                    ->disabled()
            ])
            ->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('username')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('email')
                    ->sortable()
                    ->searchable(),
                IconColumn::make('has_plan')
                    ->label('PathPro Account')
                    ->getStateUsing(
                        fn(Model $record) => $record->hasPlan()
                    )
                    ->boolean()
                    ->alignCenter()
            ])
            ->filters([
                TernaryFilter::make('lastSubscription')
                    ->label('PathPro Account')
                    ->placeholder('All')
                    ->trueLabel('Active')
                    ->falseLabel('Inactive')
                    ->queries(
                        true: fn(Builder $query) => $query->whereHas(
                            'lastSubscription',
                            fn($innerQuery) => $innerQuery->where('stripe_status', 'active')
                        ),
                        false: fn(Builder $query) => $query->whereDoesntHave('lastSubscription', function ($innerQuery) {
                            $innerQuery->where('stripe_status', '=', 'active');
                        }),
                        blank: fn(Builder $query) => $query,
                    ),
                SelectFilter::make('role')
                    ->options([
                        'user' => 'User',
                        'superAdmin' => 'Super Admin',
                    ]),
            ])
            ->recordUrl(
                fn(Model $record): string => EditUser::getUrl([$record->id]),
            );
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'edit' => EditUser::route('/{record}/edit'),
            'view' => ViewUser::route('/{record}'),
        ];
    }
}
