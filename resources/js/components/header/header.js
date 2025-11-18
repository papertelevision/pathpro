/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import HeaderSelect from '@app/components/header/header-select';
import AccountMenu from '@app/components/account-menu/account-menu';
import Button from '@app/components/button/button';
import Filter from '@app/components/filter/filter';
import useProjectCommunityMemberStoreMutation from '@app/data/project/use-project-community-member-store-mutation';
import useProjectShowQuery from '@app/data/project/use-project-show-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { useQueryContextApi } from '@app/lib/query-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const Header = ({ showHeaderSelect = false, modifier }) => {
    const [active, setActive] = useState(false);
    const [isAccountMenuVisible, setIsAccountMenuVisible] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isCurrentPagePublic =
        pathname === '/' ||
        pathname.includes('/features') ||
        pathname.includes('/release-notes') ||
        pathname.includes('/news');

    const {
        authUser,
        isUserLoggedIn,
        isAuthUserCommunityMember,
        isAuthUserAssignToProject,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAssignedToAnyProjects,
    } = usePermissionsContextApi();
    const { selectedValue, setSelectedValue } = useHeaderSelectContext();
    const { navigation } = useQueryContextApi();

    const { mutate: mutateCommunityMemberStore } =
        useProjectCommunityMemberStoreMutation(projectSlug);
    const { data: project } = useProjectShowQuery(selectedValue, {
        enabled: !!selectedValue,
    });

    const handleToggleNav = () => setActive(!active);

    useEffect(() => {
        projectSlug && setSelectedValue(projectSlug);
    }, [projectSlug]);

    const hideFeatureVotingTab =
        project?.features_count === 0 &&
        (!isAuthUserAdmitOrTeamMember(null, selectedValue) || !isUserLoggedIn);

    const hideReleaseNotesTab =
        project?.release_notes_count === 0 &&
        (!isAuthUserAdmitOrTeamMember(null, selectedValue) || !isUserLoggedIn);

    return (
        <header
            className={classNames('header', {
                [`header--${modifier}`]: modifier,
                'is-open': active,
            })}
        >
            <div className="header__left">
                {showHeaderSelect && isUserLoggedIn && <HeaderSelect />}
                <ul className="header__left-links">
                    {selectedValue && (
                        <>
                            {!hideFeatureVotingTab && (
                                <li>
                                    <NavLink
                                        to="/features"
                                        end
                                        className={({ isActive }) =>
                                            'header__link' +
                                            (isActive ||
                                            pathname.includes('feature')
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={handleToggleNav}
                                        reloadDocument={!isCurrentPagePublic}
                                    >
                                        {project?.tabs.find(
                                            (tab) =>
                                                tab.value === 'featureVoting'
                                        )?.label || 'Feature Voting'}
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        'header__link' +
                                        (isActive ||
                                        /\/task\/\d+(?:\/|$)/.test(pathname)
                                            ? ' active'
                                            : '')
                                    }
                                    onClick={handleToggleNav}
                                    reloadDocument={!isCurrentPagePublic}
                                >
                                    {project?.tabs.find(
                                        (tab) => tab.value === 'roadmap'
                                    )?.label || 'Roadmap'}
                                </NavLink>
                            </li>
                            {!hideReleaseNotesTab && (
                                <li>
                                    <NavLink
                                        to="/release-notes"
                                        end
                                        className={({ isActive }) =>
                                            'header__link' +
                                            (isActive ||
                                            pathname.includes('release-notes')
                                                ? ' active'
                                                : '')
                                        }
                                        onClick={handleToggleNav}
                                        reloadDocument={!isCurrentPagePublic}
                                    >
                                        {project?.tabs.find(
                                            (tab) =>
                                                tab.value === 'releaseNotes'
                                        )?.label || 'Release Notes'}
                                    </NavLink>
                                </li>
                            )}
                            {isUserLoggedIn &&
                                showHeaderSelect &&
                                isAuthUserAssignedToAnyProjects &&
                                isAuthUserAdmitOrTeamMember(
                                    null,
                                    selectedValue
                                ) && (
                                    <li>
                                        <NavLink
                                            to="/news"
                                            end
                                            className={({ isActive }) =>
                                                'header__link' +
                                                (isActive ||
                                                pathname.includes('news')
                                                    ? ' active'
                                                    : '')
                                            }
                                            onClick={handleToggleNav}
                                            reloadDocument={
                                                !isCurrentPagePublic
                                            }
                                        >
                                            {project?.tabs.find(
                                                (tab) =>
                                                    tab.value === 'projectNews'
                                            )?.label || 'Project News'}
                                        </NavLink>
                                    </li>
                                )}
                        </>
                    )}
                </ul>
            </div>

            {isUserLoggedIn ? (
                <div className="header__right">
                    {project?.creator.can_have_community_members &&
                        !isAuthUserAssignToProject(null, selectedValue) &&
                        selectedValue && (
                            <Button
                                type="button"
                                color="blue-gradient"
                                rounded
                                larger
                                onClick={() => mutateCommunityMemberStore()}
                                data-tooltip-id="tooltip"
                                data-tooltip-float
                                data-tooltip-variant="light"
                                data-tooltip-attr="join"
                                data-tooltip-place="bottom"
                            >
                                Join Product
                            </Button>
                        )}
                    {isAuthUserCommunityMember(null, selectedValue) &&
                        selectedValue && (
                            <Button
                                type="button"
                                color="white"
                                rounded
                                larger
                                onClick={() => mutateCommunityMemberStore()}
                                data-tooltip-id="tooltip"
                                data-tooltip-float
                                data-tooltip-variant="light"
                                data-tooltip-attr="joined"
                                data-tooltip-place="bottom"
                            >
                                You have joined this product
                            </Button>
                        )}
                    <Filter type="helperMenu" data={navigation} />
                    <button
                        className="header__right-img-button"
                        type="button"
                        onClick={() =>
                            setIsAccountMenuVisible(!isAccountMenuVisible)
                        }
                    >
                        {authUser?.avatar && !authUser.avatar.includes('user-default-img.png') ? (
                            <img src={authUser.avatar} alt="Logged User Avatar" />
                        ) : (
                            <div className="user-avatar-initials">
                                {authUser?.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                    </button>
                    <AccountMenu
                        setIsAccountMenuVisible={setIsAccountMenuVisible}
                        isVisible={isAccountMenuVisible}
                    />
                </div>
            ) : (
                <div className="header__right">
                    <NavLink
                        to="/login"
                        state={{ redirectTo: pathname }}
                        className="header__link header__link--login"
                    >
                        Login
                    </NavLink>
                    {project?.creator.can_have_community_members && (
                        <Button
                            type="button"
                            color="blue-gradient"
                            rounded
                            larger
                            onClick={() =>
                                navigate('/community-member/register', {
                                    state: { redirectTo: pathname },
                                })
                            }
                            data-tooltip-id="tooltip"
                            data-tooltip-float
                            data-tooltip-variant="light"
                            data-tooltip-attr="signUp"
                            data-tooltip-place="bottom"
                        >
                            Join Product
                        </Button>
                    )}
                </div>
            )}
            <button className="toggle-header-nav" onClick={handleToggleNav}>
                <span />
                <span />
                <span />
            </button>
        </header>
    );
};

export default Header;
