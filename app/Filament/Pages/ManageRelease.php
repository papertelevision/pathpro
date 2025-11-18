<?php

namespace App\Filament\Pages;

use App\Settings\ReleaseSettings;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\SettingsPage;

class ManageRelease extends SettingsPage
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string $settings = ReleaseSettings::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Fieldset::make('Release')
                    ->columns(1)
                    ->schema([
                        TextInput::make('version')
                            ->placeholder('Enter the version.')
                            ->required(),
                        TextInput::make('title')
                            ->placeholder('Enter the title.')
                            ->required(),
                        RichEditor::make('description')
                            ->placeholder('Enter the description.')
                            ->required(),
                    ]),

            ])
            ->columns(1);
    }
}
