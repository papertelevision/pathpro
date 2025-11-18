<?php

namespace App\Http\Controllers;

use App\Domain\Header\Enums\HeaderTabEnum;
use App\Domain\Header\Models\Header;
use App\Domain\Project\Models\Project;
use App\Http\Domain\Header\Requests\UpdateHeaderRequest;
use App\Http\Resources\HeaderResource;
use App\Notifications\CustomDomainRequiredNotification;
use Illuminate\Support\Facades\Notification;

class HeaderSettingsController extends Controller
{
    public function show(
        Project $project
    ) {
        $header = $project->header;
        $header->custom_domain = $project->custom_domain;
        $header->is_dns_configured = $project->is_dns_configured;
        $header->accent_color = $project->accent_color;

        return HeaderResource::make($header->load(['media']));
    }

    public function update(
        UpdateHeaderRequest $request,
        Header $header
    ) {
        $validated = $request->validated();

        foreach ($validated as $key => $value) {
            if ($key == 'logo' || $key == 'favicon' || $key == 'custom_domain' || $key == 'is_dns_configured' || $key == 'accent_color') {
                continue;
            }

            if ($key == 'tabs') {
                foreach ($value as $tabKey => $tab) {
                    $tabEnum =  HeaderTabEnum::from($tab['value']);

                    if (isset($tab['label'])) {
                        $value[$tabKey]['is_default'] = $tab['label'] === $tabEnum->label();
                    } else {
                        $value[$tabKey]['label'] = $tabEnum->label();
                        $value[$tabKey]['is_default'] = true;
                    }
                }
            }

            if ($key == 'submit_feedback_button_text' && $value) {
                $settings = $header->additional_settings ?: (object) [];
                $settings->submit_feedback_button_text = $value;
                $header->additional_settings = $settings;
                continue;
            }

            $header->$key = $value;
        }
        $header->save();

        if (
            $request->hasFile('logo') &&
            $request->file('logo')->isValid()
        ) {
            $header->clearMediaCollection('logo');
            $header->addMediaFromRequest('logo')->toMediaCollection('logo');
        }

        if (
            $request->hasFile('favicon') &&
            $request->file('favicon')->isValid()
        ) {
            $header->clearMediaCollection('favicon');
            $header->addMediaFromRequest('favicon')->toMediaCollection('favicon');
        }

        $project = $header->project;

        $customDomain = $request->validated('custom_domain', null);
        $project->custom_domain = $customDomain;
        $project->save();

        if ($customDomain && $project->custom_domain !== $customDomain) {

            Notification::route('mail', config('mail.admin'))
                ->notify(new CustomDomainRequiredNotification(
                    $request->user(),
                    $project,
                ));
        }

        $project->is_dns_configured = $request->validated('is_dns_configured', false);
        $project->accent_color = $request->validated('accent_color', '#3376a3');
        $project->save();

        return response([
            'message' => 'success',
        ]);
    }
}
