/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import Button from '@app/components/button/button';
import FormEditTeamMember from '@app/domain/user/components/form-edit-team-member/form-edit-team-member';
import FormInviteTeamMember from '@app/domain/user/components/form-invite-team-member/form-invite-team-member';
import Modal from '@app/components/modal/modal';
import ModalLimit from '@app/components/modal/modal-limit';
import Loader from '@app/components/loader/loader';
import AlertBox from '@app/components/alert-box/alert-box';
import useProjectTeamMemberShowQuery from '@app/data/project/use-project-team-member-show-query';
import useProjectTeamMemberDestroyMutation from '@app/data/project/use-project-team-member-destroy-mutation';
import useProjectBannedMemberUpdateMutation from '@app/data/project/use-project-banned-member-update-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UserTeamMemberShow = () => {
    const [openAlertBoxDeleteMember, setOpenAlertBoxDeleteMember] =
        useState(false);
    const [isInviteTeamMemberModalOpen, setIsInviteTeamMemberModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [openUnBanAlertBox, setOpenUnBanAlertBox] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [wipeMemberContent, setWipeMemberContent] = useState(false);
    const [banMember, setBanMember] = useState(false);
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    const { canAssignTeamMembers } = usePermissionsContextApi();
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const { userId } = useParams();

    const { isLoading: isUserDataLoading, data: teamMember } =
        useProjectTeamMemberShowQuery(projectSlug, userId);
    const { mutate: mutateUserDestroy } = useProjectTeamMemberDestroyMutation(
        projectSlug,
        userId
    );
    const { mutate: mutateMemberUpdate } = useProjectBannedMemberUpdateMutation(
        projectSlug,
        userId
    );

    const closeInviteTeamMemberModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsInviteTeamMemberModalOpen(false);
        }
    };

    const handleDeleteTeamMember = () => {
        setIsFormDisabled(true);
        mutateUserDestroy(
            { wipe_member_content: wipeMemberContent, ban_member: banMember },
            {
                onSuccess: () => {
                    setIsFormDisabled(false);
                    setOpenAlertBoxDeleteMember(false);
                    setPopupNotificationText(
                        'The user has been unassigned as a team member from the project!'
                    );
                    setIsPopupNotificationVisible(true);
                },
            }
        );
    };

    const handleRenewMemberAccess = () => {
        setIsFormDisabled(true);
        mutateMemberUpdate(_, {
            onSuccess: () => {
                setIsFormDisabled(false);
                setOpenUnBanAlertBox(false);
                setPopupNotificationText(
                    'The user access has been renewed to the given project!'
                );
                setIsPopupNotificationVisible(true);
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
                        to={
                            projectSlug
                                ? `/${projectSlug}/team-members`
                                : '/team-members'
                        }
                        className="btn-back"
                    >
                        Go Back
                    </NavLink>
                    <span className="subheader__divider" />
                    <b>Team Members</b>
                    <span className="subheader__divider" />
                    <b>{teamMember.username}</b>
                </Subheader.Left>
                <Subheader.Right>
                    <Button
                        type="button"
                        modifier="add-record"
                        icon
                        onClick={() => {
                            canAssignTeamMembers
                                ? setIsInviteTeamMemberModalOpen(true)
                                : setIsLimitModalOpen(true);
                        }}
                    >
                        Invite Team Member
                    </Button>
                </Subheader.Right>
            </Subheader>
            <Page color="gray">
                <FormEditTeamMember
                    member={teamMember}
                    setOpenAlertBox={setOpenAlertBoxDeleteMember}
                    setOpenUnBanAlertBox={setOpenUnBanAlertBox}
                    disabled={isFormDisabled}
                />
            </Page>
            <Modal
                className="full-height"
                modalIsOpen={isInviteTeamMemberModalOpen}
                setIsModalOpen={setIsInviteTeamMemberModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeInviteTeamMemberModal}
            >
                <Modal.Content>
                    <FormInviteTeamMember
                        teamMember={teamMember}
                        closeModal={closeInviteTeamMemberModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsInviteTeamMemberModalOpen={
                            setIsInviteTeamMemberModalOpen
                        }
                    />
                </Modal.Content>
            </Modal>
            {isLimitModalOpen && (
                <ModalLimit
                    isOpen={isLimitModalOpen}
                    setIsOpen={setIsLimitModalOpen}
                    type="teamMembers"
                />
            )}
            <AlertBox
                modifier="remove-member"
                isActive={openAlertBoxDeleteMember}
                setOpenAlertBox={setOpenAlertBoxDeleteMember}
                deleteAction={handleDeleteTeamMember}
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
                            'This option will ban this member from the project, and will prevent<br/> the user from rejoining the project unless you remove the ban.',
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

export default UserTeamMemberShow;
