<?php

namespace App\Filament\Resources;

use App\Domain\Plan\Enums\PlanProviderEnum;
use App\Domain\Plan\Models\Plan;
use App\Filament\Resources\PlanResource\Pages\CreatePlan;
use App\Filament\Resources\PlanResource\Pages\EditPlan;
use App\Filament\Resources\PlanResource\Pages\ListPlans;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('provider')
                    ->live()
                    ->options(PlanProviderEnum::toArray())
                    ->required(),
                TextInput::make('provider_payload.tier')
                    ->label('Tier')
                    ->numeric()
                    ->minValue(1)
                    ->visible(fn(Get $get): bool => $get('provider') == PlanProviderEnum::APPSUMO->value)
                    ->required(fn(Get $get): bool => $get('provider') == PlanProviderEnum::APPSUMO->value)
                    ->helperText('Identifier of the AppSumo license tier (1, 2, etc).'),
                TextInput::make('name')
                    ->unique(table: Plan::class, ignoreRecord: true)
                    ->required(),
                RichEditor::make('description')
                    ->required()
                    ->disableToolbarButtons([
                        'attachFiles',
                    ]),
                Repeater::make('features')
                    ->schema([
                        RichEditor::make('feature')
                            ->label('')
                            ->live(onBlur: true)
                            ->required()
                            ->disableToolbarButtons([
                                'h2',
                                'h3',
                                'strike',
                                'codeBlock',
                                'bulletList',
                                'blockquote',
                                'orderedList',
                                'attachFiles',
                            ])
                    ])
                    ->addActionLabel('Add feature')
                    ->reorderableWithButtons()
                    ->itemLabel(function () {
                        static $position = 1;
                        return 'Feature ' . $position++;
                    }),
                TextInput::make('price')
                    ->afterStateHydrated(function (TextInput $component, $state) {
                        $component->state($state / 100);
                    })
                    ->dehydrateStateUsing(fn($state) => (int) round($state * 100))
                    ->numeric()
                    ->inputMode('decimal')
                    ->prefix('$')
                    ->suffix('USD'),
                TextInput::make('yearly_discount_percentage')
                    ->default(0)
                    ->numeric()
                    ->inputMode('decimal')
                    ->minValue(0)
                    ->maxValue(100)
                    ->suffix('%'),
                TextInput::make('projects_count')
                    ->helperText('Leave it empty if it\'s unlimited.')
                    ->numeric()
                    ->minValue(0),
                TextInput::make('community_members_count')
                    ->helperText('Leave it empty if it\'s unlimited.')
                    ->numeric()
                    ->minValue(0),
                TextInput::make('team_members_count')
                    ->helperText('Leave it empty if it\'s unlimited.')
                    ->numeric()
                    ->minValue(0),
                TextInput::make('tech_support_type'),
                Checkbox::make('is_recommended'),
                Checkbox::make('is_white_labeled'),
                Checkbox::make('are_private_projects_allowed'),
                Checkbox::make('are_file_attachments_allowed'),
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
                TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('provider')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('price')
                    ->money('USD', divideBy: 100)
                    ->sortable()
                    ->searchable(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPlans::route('/'),
            'create' => CreatePlan::route('/create'),
            'edit' => EditPlan::route('/{record}/edit'),
        ];
    }
}
