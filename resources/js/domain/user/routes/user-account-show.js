/**
 * External dependencies
 */
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Header from '@app/components/header/header';
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import FormEditAccount from '@app/domain/user/components/form-edit-account/form-edit-account';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const UserAccountShow = () => {
    const navigate = useNavigate();

    const { authUser, isAuthUserAdminOrTeamMemberToAnyProjects } =
        usePermissionsContextApi();

    return (
        <BaseLayout
            hideSidebar={
                !authUser?.has_plan && !isAuthUserAdminOrTeamMemberToAnyProjects
            }
        >
            <Header showHeaderSelect />
            <Subheader>
                <Subheader.Left>
                    {!isAuthUserAdminOrTeamMemberToAnyProjects && (
                        <>
                            <NavLink
                                onClick={() => navigate(-1)}
                                to=""
                                className="btn-back"
                            >
                                Go Back
                            </NavLink>
                            <span className="subheader__divider" />
                        </>
                    )}
                    <b>Account</b>
                    <span className="subheader__divider" />
                    <b>{authUser.username}</b>
                </Subheader.Left>
            </Subheader>
            <Page color="gray">
                <FormEditAccount />
            </Page>
        </BaseLayout>
    );
};

export default UserAccountShow;
