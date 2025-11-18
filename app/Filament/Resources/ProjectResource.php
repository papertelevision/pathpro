<?php

namespace App\Filament\Resources;

use App\Domain\Project\Models\Project;
use App\Filament\Resources\ProjectResource\Pages;
use Filament\Forms\Components\Actions;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->disabled()
                    ->readOnly(),

                TextInput::make('slug')
                    ->disabled()
                    ->readOnly(),

                TextInput::make('custom_domain'),

                Checkbox::make('is_dns_configured')
                    ->label('DNS point to 66.51.120.162'),

                Checkbox::make('is_custom_domain_configured')
                    ->label('Domain configured in Approximated'),

                Fieldset::make('Owner')
                    ->relationship('creator')
                    ->schema([
                        TextInput::make('id'),

                        TextInput::make('name'),

                        TextInput::make('username'),

                        Actions::make([
                            Action::make('View Owner')
                                ->url(fn($record) => route('filament.admin.resources.users.edit', $record))
                        ])->alignCenter(),
                    ])
                    ->disabled()
                    ->columns(1),
            ])
            ->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->searchable(),

                TextColumn::make('title')
                    ->searchable(),

                TextColumn::make('slug')
                    ->searchable(),

                TextColumn::make('creator.name')
                    ->label('Owner')
                    ->searchable(),

                TextColumn::make('custom_domain')
                    ->default('N/A')
                    ->searchable(),

                IconColumn::make('is_dns_configured')
                    ->label('DNS configured')
                    ->boolean()
                    ->alignCenter(),

                IconColumn::make('is_custom_domain_configured')
                    ->label('Domain configured in Approximated')
                    ->boolean()
                    ->alignCenter(),
            ])
            ->actions([
                EditAction::make(),
            ])
            ->recordUrl(fn() => null);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
