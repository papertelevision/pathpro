/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import FormEditBannedMember from '@app/domain/user/components/form-edit-banned-member/form-edit-banned-member';
import Loader from '@app/components/loader/loader';
import AlertBox from '@app/components/alert-box/alert-box';
import useProjectBannedMemberShowQuery from '@app/data/project/use-project-banned-member-show-query';
import useProjectBannedMemberUpdateMutation from '@app/data/project/use-project-banned-member-update-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UserBannedMemberShow = () => {
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    const { isLoading: isMemberDataLoading, data: memberData } =
        useProjectBannedMemberShowQuery(projectSlug, userId);

    const { mutate: mutateMemberUpdate } = useProjectBannedMemberUpdateMutation(
        projectSlug,
        userId
    );

    const handleRenewMemberAccess = () =>
        mutateMemberUpdate(userId, {
            onSuccess: () => {
                setPopupNotificationText('The member access has been renewed!');
                setIsFormDisabled(true);
                setIsPopupNotificationVisible(true);
                setOpenAlertBox(false);
                navigate('/banned-members');
            },
        });

    if (isMemberDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left title="Banned Members" separator>
                    <i>{memberData.username}</i>
                </Subheader.Left>
            </Subheader>
            <Page gray="gray">
                <FormEditBannedMember
                    member={memberData}
                    setOpenAlertBox={setOpenAlertBox}
                    disabled={isFormDisabled}
                />
            </Page>
            <AlertBox
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                deleteAction={handleRenewMemberAccess}
                message={`Are you sure you want to renew the member access to ${
                    projectSlug ? 'this project?' : 'all your projects?'
                }`}
            />
        </>
    );
};

export default UserBannedMemberShow;
