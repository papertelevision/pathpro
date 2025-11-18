/**
 * External dependencies
 */
import React from 'react';
import { Routes as Router, Route, Navigate } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Header from '@app/components/header/header';
import Dashboard from '@app/domain/user/pages/dashboard';
import BaseLayout from '@app/components/base-layout/base-layout';
import LoginIndex from '@app/domain/auth/login/routes/login-index';
import FormCommunityMemberRegister from '@app/domain/auth/register/components/form-community-member-register';
import FormTeamMemberRegister from '@app/domain/auth/register/components/form-team-member-register';
import FormTeamMemberLogin from '@app/domain/auth/login/components/form-team-member-login/form-team-member-login';
import ProjectsIndex from '@app/domain/project/routes/projects-index';
import ProjectShow from '@app/domain/project/routes/project-show';
import UsersCommunityMembersIndex from '@app/domain/user/routes/users-community-members-index';
import UserCommunityMemberShow from '@app/domain/user/routes/user-community-member-show';
import UserAccountShow from '@app/domain/user/routes/user-account-show';
import UsersTeamMembersIndex from '@app/domain/user/routes/users-team-members-index';
import UserTeamMemberShow from '@app/domain/user/routes/user-team-member-show';
import UsersBannedMembersIndex from '@app/domain/user/routes/users-banned-members-index';
import UserBannedMemberShow from './domain/user/routes/user-banned-member-show';
import SubmissionsIndex from '@app/domain/submission/routes/submissions-index';
import SubmissionShow from '@app/domain/submission/routes/submission-show';
import StripeProductShow from '@app/domain/stripe/routes/stripe-product-show';
import HeaderSettingsPage from '@app/domain/header/pages/header-settings-page';
import ResetPasswordIndex from '@app/domain/password/routes/reset-password-index';
import ForgotPasswordIndex from '@app/domain/password/routes/forgot-password-index';
import Register from '@app/domain/auth/register/components/register';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const Routes = () => {
    const {
        isUserLoggedIn,
        authUser,
        isAuthUserAdminToAnyProjects,
        isAuthUserAdminOrTeamMemberToAnyProjects,
    } = usePermissionsContextApi();

    const hasMembersPagesAccess =
        isUserLoggedIn && (authUser.has_plan || isAuthUserAdminToAnyProjects);

    return (
        <Router>
            <Route
                path="/stripe-purchase-product/:stripeProductSlug/*"
                element={<StripeProductShow />}
            />
            <Route path="/forgot-password" element={<ForgotPasswordIndex />} />
            <Route path="/account" element={<UserAccountShow />} />
            <Route
                path="/create-new-password/:email"
                element={<ResetPasswordIndex />}
            />
            <Route path="/login" element={<LoginIndex />} />
            <Route
                path="/community-member/register"
                element={<FormCommunityMemberRegister />}
            />
            <Route path="/register" element={<Register />} />
            <Route
                path="/team-member-invitation/register"
                element={<FormTeamMemberRegister />}
            />
            <Route
                path="/team-member-invitation/login"
                element={
                    isUserLoggedIn ? (
                        <Navigate to="/projects" />
                    ) : (
                        <FormTeamMemberLogin />
                    )
                }
            />
            <Route
                path="/dashboard"
                element={
                    authUser?.has_plan ? (
                        <Dashboard />
                    ) : (
                        <Navigate to="/account" />
                    )
                }
            />
            <Route
                path="/projects"
                element={
                    authUser?.has_plan ||
                    isAuthUserAdminOrTeamMemberToAnyProjects ? (
                        <ProjectsIndex />
                    ) : (
                        <Navigate to="/account" />
                    )
                }
            />
            <Route
                path="/:projectSlug/edit"
                element={
                    authUser?.has_plan ? (
                        <ProjectsIndex />
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                key="submissions"
                path="/submissions"
                element={
                    <RouteElementWrapper>
                        <SubmissionsIndex />
                    </RouteElementWrapper>
                }
            />
            <Route
                path="/submissions/:submissionId"
                element={
                    <RouteElementWrapper>
                        <SubmissionShow />
                    </RouteElementWrapper>
                }
            />
            <Route
                path="/community-members"
                element={
                    hasMembersPagesAccess ? (
                        <RouteElementWrapper>
                            <UsersCommunityMembersIndex />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/community-members/:userId"
                element={
                    hasMembersPagesAccess ? (
                        <RouteElementWrapper>
                            <UserCommunityMemberShow />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/team-members"
                element={
                    hasMembersPagesAccess && !authUser.plan?.is_free ? (
                        <RouteElementWrapper>
                            <UsersTeamMembersIndex />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/team-members/:userId"
                element={
                    hasMembersPagesAccess && !authUser.plan?.is_free ? (
                        <RouteElementWrapper>
                            <UserTeamMemberShow />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/banned-members"
                element={
                    hasMembersPagesAccess ? (
                        <RouteElementWrapper>
                            <UsersBannedMembersIndex />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/banned-members/:userId"
                element={
                    hasMembersPagesAccess ? (
                        <RouteElementWrapper>
                            <UserBannedMemberShow />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route
                path="/header-settings"
                element={
                    isAuthUserAdminOrTeamMemberToAnyProjects ? (
                        <RouteElementWrapper>
                            <HeaderSettingsPage />
                        </RouteElementWrapper>
                    ) : (
                        <Navigate to="/projects" />
                    )
                }
            />
            <Route path="/*" element={<ProjectShow />} />
        </Router>
    );
};

const RouteElementWrapper = ({ children }) => (
    <BaseLayout>
        <Header showHeaderSelect />
        {children}
    </BaseLayout>
);

export default Routes;
