<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HeaderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'tabs' => $this->getTabs(),
            'width' => $this->width,
            'height' => $this->height,
            'logo_url' => $this->logo_url,
            'menu_links' => $this->menu_links,
            'custom_css' => $this->custom_css,
            'is_included' => $this->is_included,
            'background_color' => $this->background_color,
            'open_logo_url_in_new_tab' => $this->open_logo_url_in_new_tab,
            'logo' => $this->getFirstMediaUrl('logo'),
            'logo_data' => $this->getFirstMedia('logo'),
            'favicon' => $this->getFirstMediaUrl('favicon'),
            'favicon_data' => $this->getFirstMedia('favicon'),
            'custom_domain' => $this?->custom_domain,
            'is_dns_configured' => $this?->is_dns_configured ?? false,
            'submit_feedback_button_text' => $this->getSubmitFeedbackButtonText(),
        ];
    }
}
