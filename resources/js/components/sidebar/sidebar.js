/**
 * External dependencies
 */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const Sidebar = () => {
    const { pathname } = useLocation();

    const handleToggle = () =>
        document.querySelector('body').classList.toggle('nav-is-open');

    const {
        authUser,
        canUpdateProject,
        canEditCustomHeader,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAdminToAnyProjects,
        isAuthUserAdminOrTeamMemberToAnyProjects,
    } = usePermissionsContextApi();

    const { selectedValue } = useHeaderSelectContext();

    const showSubmissionsTab =
        (!selectedValue &&
            (authUser.has_plan || isAuthUserAdminOrTeamMemberToAnyProjects)) ||
        (selectedValue && isAuthUserAdmitOrTeamMember(null, selectedValue));
    const showMembersTabs =
        (!selectedValue &&
            (authUser.has_plan || isAuthUserAdminToAnyProjects)) ||
        (selectedValue && canUpdateProject(null, selectedValue));

    const disableSubmissionsAndMemberTabs = authUser.has_to_create_project;

    const showSettingsTab =
        !authUser.has_to_create_project &&
        (!selectedValue || canEditCustomHeader(null, selectedValue));

    return (
        <div className="sidebar">
            <button className="toggle-sidebar" onClick={handleToggle}></button>
            <div className="sidebar__container">
                {authUser.has_plan ? (
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            classNames(
                                'sidebar__link',
                                'sidebar__link--dashboard',
                                {
                                    active: isActive,
                                }
                            )
                        }
                        id="dashboard"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Dashboard"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <div className="sidebar__link-inner">
                            <Icon type="home" />
                        </div>
                    </NavLink>
                ) : (
                    <span className="sidebar__link sidebar__link--dashboard"></span>
                )}
                <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        classNames('sidebar__link', {
                            active: isActive,
                        })
                    }
                    id="projects"
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Projects"
                    data-tooltip-variant="light"
                    data-tooltip-place="right"
                >
                    <Icon type="projects" />
                </NavLink>
                {showSubmissionsTab && (
                    <NavLink
                        to="/submissions"
                        className={({ isActive }) =>
                            classNames('sidebar__link', {
                                active:
                                    isActive || pathname.includes('submission'),
                                disabled: disableSubmissionsAndMemberTabs,
                            })
                        }
                        onClick={(e) =>
                            disableSubmissionsAndMemberTabs &&
                            e.preventDefault()
                        }
                        id="submissions"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Submissions"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <Icon type="submissions" />
                    </NavLink>
                )}
                {showMembersTabs && (
                    <NavLink
                        to="/community-members"
                        className={({ isActive }) =>
                            classNames('sidebar__link', {
                                active:
                                    isActive ||
                                    pathname.includes('community-member'),
                                disabled: disableSubmissionsAndMemberTabs,
                            })
                        }
                        onClick={(e) =>
                            disableSubmissionsAndMemberTabs &&
                            e.preventDefault()
                        }
                        id="communityMembers"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Community Members"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <Icon type="community" />
                    </NavLink>
                )}
            </div>

            <div className="sidebar__container">
                {showMembersTabs &&
                    (authUser.plan?.is_free ? (
                        <span
                            id="teamMembers"
                            className="sidebar__link disabled"
                            data-tooltip-class-name="react-tooltip--team-members"
                            data-tooltip-id="tooltip"
                            data-tooltip-attr="free-plan-team-members"
                            data-tooltip-variant="light"
                            data-tooltip-place="right"
                            data-tooltip-offset="7"
                        >
                            <Icon type="team" />
                        </span>
                    ) : (
                        <NavLink
                            to="/team-members"
                            className={({ isActive }) =>
                                classNames('sidebar__link', {
                                    active:
                                        isActive ||
                                        pathname.includes('team-member'),
                                    disabled: disableSubmissionsAndMemberTabs,
                                })
                            }
                            onClick={(e) =>
                                disableSubmissionsAndMemberTabs &&
                                e.preventDefault()
                            }
                            id="teamMembers"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Team Members"
                            data-tooltip-variant="light"
                            data-tooltip-place="right"
                        >
                            <Icon type="team" />
                        </NavLink>
                    ))}
                {showMembersTabs && (
                    <NavLink
                        to="/banned-members"
                        className={({ isActive }) =>
                            classNames('sidebar__link', {
                                active:
                                    isActive ||
                                    pathname.includes('banned-member'),
                                disabled: disableSubmissionsAndMemberTabs,
                            })
                        }
                        onClick={(e) =>
                            disableSubmissionsAndMemberTabs &&
                            e.preventDefault()
                        }
                        id="bannedMembers"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Banned Members"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <Icon type="banned_members" />
                    </NavLink>
                )}
                {showSettingsTab ? (
                    <NavLink
                        to="/header-settings"
                        className={({ isActive }) =>
                            classNames('sidebar__link', {
                                active: isActive,
                            })
                        }
                        id="settings"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Settings & Design"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <Icon type="settings" />
                    </NavLink>
                ) : (
                    <span
                        id="settings"
                        className="sidebar__link disabled"
                        data-tooltip-content="Settings & Design"
                        data-tooltip-variant="light"
                        data-tooltip-place="right"
                    >
                        <Icon type="settings" />
                    </span>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
