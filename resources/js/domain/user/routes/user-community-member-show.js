/**
 * External dependencies
 */
import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import FormEditCommunityMemberProfile from '@app/domain/user/components/form-edit-community-member-profile/form-edit-community-member-profile';
import Loader from '@app/components/loader/loader';
import AlertBox from '@app/components/alert-box/alert-box';
import useProjectCommunityMemberDestroyMutation from '@app/data/project/use-project-community-member-destroy-mutation';
import useProjectCommunityMemberShowQuery from '@app/data/project/use-project-community-member-show-query';
import useProjectBannedMemberUpdateMutation from '@app/data/project/use-project-banned-member-update-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UserCommunityMemberShow = () => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [openUnBanAlertBox, setOpenUnBanAlertBox] = useState(false);
    const [wipeMemberContent, setWipeMemberContent] = useState(false);
    const [banMember, setBanMember] = useState(false);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const { userId } = useParams();

    const { isLoading: isUserDataLoading, data: userData } =
        useProjectCommunityMemberShowQuery(projectSlug, userId);
    const { mutate: mutateUserDestroy } =
        useProjectCommunityMemberDestroyMutation(projectSlug, userId);
    const { mutate: mutateMemberUpdate } = useProjectBannedMemberUpdateMutation(
        projectSlug,
        userId
    );

    const handleDeleteCommunityMember = () => {
        setIsFormDisabled(true);
        mutateUserDestroy(
            {
                wipe_member_content: wipeMemberContent,
                ban_member: banMember,
            },
            {
                onSuccess: () => {
                    setIsFormDisabled(false);
                    setPopupNotificationText(
                        'The user has been unassigned as a community member from the project!'
                    );
                    setIsPopupNotificationVisible(true);
                    setOpenAlertBox(false);
                },
            }
        );
    };

    const handleRenewMemberAccess = () => {
        setIsFormDisabled(true);
        mutateMemberUpdate(_, {
            onSuccess: () => {
                setIsFormDisabled(false);
                setPopupNotificationText(
                    'The user access has been renewed to the given project!'
                );
                setIsPopupNotificationVisible(true);
                setOpenUnBanAlertBox(false);
            },
        });
    };

    if (isUserDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left>
                    <NavLink
                        to="/community-members"
                        className="btn-back"
                    >
                        Go Back
                    </NavLink>
                    <span className="subheader__divider" />
                    <b>Community Members</b>
                    <span className="subheader__divider" />
                    <b>{userData.username}</b>
                </Subheader.Left>
            </Subheader>
            <Page color="gray">
                <FormEditCommunityMemberProfile
                    member={userData}
                    setOpenAlertBox={setOpenAlertBox}
                    setOpenUnBanAlertBox={setOpenUnBanAlertBox}
                    disabled={isFormDisabled}
                />
            </Page>
            <AlertBox
                modifier="remove-member"
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                deleteAction={handleDeleteCommunityMember}
                message="Are you sure you want to remove this member from this project? Additionally, you may wipe all
                of their content, <br/> and/or ban them from the project altogether. Select all that apply below, or
                simply click “Confirm” to remove them from the project without removing their contributions."
                additionalActions={[
                    {
                        title: 'Wipe member content',
                        description:
                            'Select to fully remove all comments, upvotes, stats, and other details associated with this member. This cannot be undone! Note: the user can rejoin the project in the future unless you also select the “Ban Member” option below.',
                        handler: (e) => setWipeMemberContent(e.target.checked),
                    },
                    {
                        title: 'Ban member',
                        description:
                            'This option will ban this member from the project, and will prevent the user from rejoining the project unless you remove the ban.',
                        handler: (e) => setBanMember(e.target.checked),
                    },
                ]}
            />
            <AlertBox
                isActive={openUnBanAlertBox}
                setOpenAlertBox={setOpenUnBanAlertBox}
                deleteAction={handleRenewMemberAccess}
                message="Are you sure you want to renew the member access to this project?"
            />
        </>
    );
};

export default UserCommunityMemberShow;
