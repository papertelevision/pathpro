/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Header from '@app/components/header/header';
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';
import Widget from '@app/components/widget/widget';
import Select from '@app/components/select/select';
import ModalOnBoarding from '@app/components/modal/modal-onboarding';
import Loader from '@app/components/loader/loader';
import useReleaseSettingsShowQuery from '@app/data/settings/use-release-settings-show-query';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useDomain, useSubdomain } from '@app/lib/domain';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const Dashboard = () => {
    const { isLoading: areReleaseSettingsLoading, data: releaseSettings } =
        useReleaseSettingsShowQuery();
    const { projects: queryProjects, navigation } = useQueryContextApi();
    const { setSelectedValue } = useHeaderSelectContext();
    const { authUser } = usePermissionsContextApi();

    const navigate = useNavigate();

    const projects = queryProjects.filter(
        (project) => project.creator_id === authUser.id
    );
    const contactUsLink = navigation.find(
        (item) => item.type === 'support-link'
    )?.value;

    const currentProject = projects.find(
        (project) => project.slug === projectSlug
    );

    const enableOnboarding =
        (!authUser.has_finished_onboarding &&
            !localStorage.getItem('onboardingSkipped')) ||
        !!localStorage.getItem('onboardingRestarted');

    const [isOnboardingActive, setIsOnboardingActive] =
        useState(enableOnboarding);
    const [isModalOnboardingOpen, setIsModalOnboardingOpen] =
        useState(enableOnboarding);

    const [communityMembersProject, setCommunityMembersProject] = useState(
        currentProject && {
            label: currentProject.title,
            value: currentProject?.slug,
        }
    );
    const [teamMembersProject, setTeamMembersProject] = useState(
        currentProject && {
            label: currentProject.title,
            value: currentProject.slug,
        }
    );
    const [featuresProject, setFeaturesProject] = useState(
        currentProject && {
            label: currentProject.title,
            value: currentProject.slug,
        }
    );

    const getMembersCount = (project, type) =>
        project
            ? projects.find((pr) => pr.slug === project?.value)[type]
            : projects.reduce((accumulator, project) => {
                  return accumulator + project[type];
              }, 0);

    const handleOnClickOpenIcon = (project, page) => {
        window.open(
            project ? useSubdomain(project.value, page) : useDomain(page)
        );
    };

    if (areReleaseSettingsLoading) {
        return <Loader white fixed />;
    }

    return (
        <BaseLayout>
            <Header showHeaderSelect />
            <Subheader modifier="dashboard">
                <div className="subheader__content">
                    <strong className="subheader__title">
                        ACCOUNT DASHBOARD
                    </strong>
                </div>
            </Subheader>
            <Page color="white">
                <div className="holder-widgets">
                    <div className="holder-widgets__column">
                        {!authUser.is_super_admin && (
                            <div className="holder-widgets__row">
                                <div className="holder-widgets__group">
                                    <Widget modifier="horizontal">
                                        <div className="widget__group">
                                            <span>Your Plan:</span>
                                            <strong className="is-blue">
                                                {authUser.plan?.name}
                                            </strong>
                                        </div>
                                        <div className="widget__group">
                                            <Button
                                                modifier="widget"
                                                onClick={() =>
                                                    navigate('/account')
                                                }
                                            >
                                                View/Upgrade Your Plan
                                            </Button>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="holder-widgets__column">
                        <div className="holder-widgets__row">
                            <div className="holder-widgets__group">
                                <div className="holder-widgets__group-head">
                                    <div className="holder-widgets__group-head__left">
                                        <Icon type="community" />
                                        <strong>COMMUNITY MEMBERS</strong>
                                    </div>
                                    <Icon
                                        type="question"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-float
                                        data-tooltip-variant="light"
                                        data-tooltip-place="bottom"
                                        data-tooltip-attr="question-community"
                                    />
                                </div>
                                <div className="holder-widgets__group-body">
                                    <Widget modifier="vertical">
                                        <Select
                                            data={projects}
                                            value={communityMembersProject}
                                            setValue={
                                                setCommunityMembersProject
                                            }
                                            defaultValue={{
                                                label: 'All Projects',
                                                value: null,
                                            }}
                                        />
                                        <div className="widget__group">
                                            <h1>
                                                {getMembersCount(
                                                    communityMembersProject,
                                                    'community_members_count'
                                                )}
                                            </h1>
                                        </div>
                                        <div className="widget__footer">
                                            <span className="widget-text-blue">
                                                {getMembersCount(
                                                    communityMembersProject,
                                                    'new_community_members_count'
                                                )}{' '}
                                                new{' '}
                                            </span>{' '}
                                            |{' '}
                                            {getMembersCount(
                                                communityMembersProject,
                                                'community_members_count'
                                            )}{' '}
                                            total
                                            <button
                                                className={classNames(
                                                    'widget__footer-button',
                                                    {
                                                        disabled:
                                                            authUser.has_to_create_project,
                                                    }
                                                )}
                                                onClick={() =>
                                                    handleOnClickOpenIcon(
                                                        communityMembersProject,
                                                        'community-members'
                                                    )
                                                }
                                            >
                                                <Icon
                                                    type="open"
                                                    data-tooltip-id="tooltip"
                                                    data-tooltip-content={
                                                        communityMembersProject
                                                            ? `See ${communityMembersProject.label} Community Members`
                                                            : 'See All Community Members'
                                                    }
                                                    data-tooltip-float
                                                    data-tooltip-variant="light"
                                                    data-tooltip-place="bottom"
                                                />
                                            </button>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                            <div className="holder-widgets__group">
                                <div className="holder-widgets__group-head">
                                    <div className="holder-widgets__group-head__left">
                                        <Icon
                                            type="team"
                                            width="28px"
                                            height="28px"
                                        />
                                        <strong>TEAM MEMBERS</strong>
                                    </div>
                                    <Icon
                                        type="question"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-float
                                        data-tooltip-variant="light"
                                        data-tooltip-place="bottom"
                                        data-tooltip-attr="question-team"
                                    />
                                </div>
                                <div className="holder-widgets__group-body">
                                    <Widget modifier="vertical">
                                        <Select
                                            data={projects}
                                            value={teamMembersProject}
                                            setValue={setTeamMembersProject}
                                            defaultValue={{
                                                label: 'All Projects',
                                                value: null,
                                            }}
                                        />
                                        <div className="widget__group">
                                            <h1>
                                                {getMembersCount(
                                                    teamMembersProject,
                                                    'team_members_count'
                                                )}
                                            </h1>
                                        </div>
                                        <div className="widget__footer">
                                            <button
                                                className={classNames(
                                                    'widget__footer-button',
                                                    {
                                                        disabled:
                                                            authUser.has_to_create_project,
                                                    }
                                                )}
                                                onClick={() =>
                                                    handleOnClickOpenIcon(
                                                        teamMembersProject,
                                                        'team-members'
                                                    )
                                                }
                                            >
                                                <Icon
                                                    type="open"
                                                    data-tooltip-id="tooltip"
                                                    data-tooltip-content={
                                                        teamMembersProject
                                                            ? `See ${teamMembersProject.label} Team Members`
                                                            : 'See All Team Members'
                                                    }
                                                    data-tooltip-float
                                                    data-tooltip-variant="light"
                                                    data-tooltip-place="bottom"
                                                />
                                            </button>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                        </div>
                        <div className="holder-widgets__row">
                            <div className="holder-widgets__group">
                                <div className="holder-widgets__group-head">
                                    <div className="holder-widgets__group-head__left">
                                        <strong>NEWS & UPDATES</strong>
                                    </div>
                                </div>
                                <div className="holder-widgets__group-body">
                                    <Widget
                                        modifier="vertical"
                                        className="is-scrollable is-relative"
                                    >
                                        <div className="widget__group">
                                            <div className="widget__group-text-wrapper widget__group-text-wrapper--rich-text">
                                                <p className="widget__group-text-wrapper__title">
                                                    <strong>
                                                        {releaseSettings.title}
                                                    </strong>
                                                </p>
                                                {parse(
                                                    DOMPurify.sanitize(
                                                        releaseSettings.description
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="widget__footer is-absolute justify-start">
                                            <small>
                                                Current Version:{' '}
                                                {releaseSettings.version}
                                            </small>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="holder-widgets__column">
                        <div className="holder-widgets__row">
                            <div className="holder-widgets__group">
                                <div className="holder-widgets__group-head">
                                    <div className="holder-widgets__group-head__left">
                                        <Icon
                                            type="submissions"
                                            width="28px"
                                            height="28px"
                                        />
                                        <strong>FEATURE REQUESTS</strong>
                                    </div>
                                    <Icon
                                        type="question"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-float
                                        data-tooltip-variant="light"
                                        data-tooltip-place="bottom"
                                        data-tooltip-attr="question-feature-requests"
                                    />
                                </div>
                                <div className="holder-widgets__group-body">
                                    <Widget modifier="vertical">
                                        <Select
                                            data={projects}
                                            value={featuresProject}
                                            setValue={setFeaturesProject}
                                            defaultValue={{
                                                label: 'All Projects',
                                                value: null,
                                            }}
                                        />
                                        <div className="widget__group">
                                            <h1>
                                                {getMembersCount(
                                                    featuresProject,
                                                    'submissions_count'
                                                )}
                                            </h1>
                                        </div>
                                        <div className="widget__footer">
                                            <span className="widget-text-blue">
                                                {getMembersCount(
                                                    featuresProject,
                                                    'new_submissions_count'
                                                )}{' '}
                                                new{' '}
                                            </span>{' '}
                                            |{' '}
                                            {getMembersCount(
                                                featuresProject,
                                                'submissions_count'
                                            )}{' '}
                                            total
                                            <button
                                                className={classNames(
                                                    'widget__footer-button',
                                                    {
                                                        disabled:
                                                            authUser.has_to_create_project,
                                                    }
                                                )}
                                                onClick={() =>
                                                    handleOnClickOpenIcon(
                                                        featuresProject,
                                                        'submissions'
                                                    )
                                                }
                                            >
                                                <Icon
                                                    type="open"
                                                    data-tooltip-id="tooltip"
                                                    data-tooltip-content={
                                                        featuresProject
                                                            ? `See ${featuresProject.label} Submissions`
                                                            : 'See All Submissions'
                                                    }
                                                    data-tooltip-float
                                                    data-tooltip-variant="light"
                                                    data-tooltip-place="bottom"
                                                />
                                            </button>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                        </div>
                        <div className="holder-widgets__row">
                            <div className="holder-widgets__group">
                                <div className="holder-widgets__group-head">
                                    <div className="holder-widgets__group-head__left">
                                        <strong>CONTACT SUPPORT</strong>
                                    </div>
                                </div>
                                <div className="holder-widgets__group-body">
                                    <Widget modifier="vertical justify-around">
                                        <div className="widget__group">
                                            <div className="widget__group-text-wrapper">
                                                <p className="widget__group-text-wrapper__title">
                                                    <strong>
                                                        Issues or Questions?
                                                    </strong>
                                                </p>
                                                <p>
                                                    Contact PathPro Support
                                                    below to speak to a
                                                    dedicated PathPro tech
                                                    support agent.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="widget__footer">
                                            <Button
                                                modifier="widget"
                                                color="darker"
                                                onClick={() =>
                                                    (window.location.href =
                                                        contactUsLink)
                                                }
                                            >
                                                Contact Support
                                            </Button>
                                        </div>
                                    </Widget>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
            <ModalOnBoarding
                isOpen={isModalOnboardingOpen}
                setIsOpen={setIsModalOnboardingOpen}
                isOnboardingActive={isOnboardingActive}
                setIsOnboardingActive={setIsOnboardingActive}
            />
        </BaseLayout>
    );
};

export default Dashboard;
