<?php

namespace App\Filament\Pages;

use App\Settings\PagesSettings;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\SettingsPage;

class ManagePages extends SettingsPage
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string $settings = PagesSettings::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Fieldset::make('Pages URLs')
                    ->columns(1)
                    ->schema([
                        TextInput::make('pricing_page_url')
                            ->label('Pricing page')
                            ->placeholder('Enter the Pricing page URL.')
                            ->required(),
                        TextInput::make('terms_of_purchase_page_url')
                            ->label('Terms of Purchase page')
                            ->placeholder('Enter the Terms of Purchase page URL.')
                            ->required(),
                    ]),

            ])
            ->columns(1);
    }
}
