<?php

namespace App\Domain\User\Actions;

use App\Domain\Plan\Models\Plan;
use App\Domain\Project\Models\Project;
use App\Domain\User\Models\User;
use App\Providers\RouteServiceProvider;

class GetRedirectUrlAction
{
    public function handle(
        User $authUser,
        string $plan = null,
        bool $isMonthlySubscription = true,
    ) {
        if ($plan) {
            return parse_url(
                url(route(
                    'stripe-product.billing',
                    ['plan' => Plan::where('slug', $plan)->first()],
                    false
                )),
                PHP_URL_PATH
            ) . '?subscription-type=' . ($isMonthlySubscription ? 'monthly' : 'yearly');
        }

        $assignedAsAdmin = $authUser->assignedAsAdminToProjects()->select('id')->get()->pluck('id')->toArray();
        $assignedAsTeamMember = $authUser->assignedAsTeamMemberToProjects()->select('id')->get()->pluck('id')->toArray();
        $assignedAsCommunityMember = $authUser->assignedAsCommunityMemberToProjects()->public()->select('id')->get()->pluck('id')->toArray();

        if (
            $authUser->hasPlan()
        ) {
            return RouteServiceProvider::DASHBOARD;
        }

        if (
            $assignedAsTeamMember ||
            ($assignedAsAdmin &&
                !$authUser->hasPlan())
        ) {
            return RouteServiceProvider::HOME;
        }

        if ($assignedAsCommunityMember) {
            return parse_url(url(route('project.show', ['project' => Project::find(end($assignedAsCommunityMember))], false)), PHP_URL_PATH);
        }

        return parse_url(url('account'), PHP_URL_PATH);
    }
}
