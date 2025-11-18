/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import Page from '@app/components/page/page';
import TableTeamMembers from '@app/domain/user/components/table-team-members/table-team-members';
import Modal from '@app/components/modal/modal';
import ModalLimit from '@app/components/modal/modal-limit';
import FormInviteTeamMember from '@app/domain/user/components/form-invite-team-member/form-invite-team-member';
import Loader from '@app/components/loader/loader';
import useProjectTeamMembersIndexQuery from '@app/data/project/use-project-team-members-index-query';
import useTeamMembersInvitationsIndexQuery from '@app/data/team-member-invitation/use-team-members-invitations-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UsersTeamMembersIndex = () => {
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [isInviteTeamMemberModalOpen, setIsInviteTeamMemberModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });
    const { canAssignTeamMembers } = usePermissionsContextApi();

    const {
        data: teamMembersInvitations,
        isLoading: isTeamMembersInvitationsDataLoading,
    } = useTeamMembersInvitationsIndexQuery(projectSlug);

    const { data: teamMembers, isLoading: isProjectTeamMembersDataLoading } =
        useProjectTeamMembersIndexQuery(
            projectSlug,
            currentTablePage,
            queryArgs
        );

    const closeInviteTeamMemberModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsInviteTeamMemberModalOpen(false);
        }
    };

    if (
        isTeamMembersInvitationsDataLoading ||
        isProjectTeamMembersDataLoading
    ) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left title="Team Members" />

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
            <Page upper color="gray">
                <TableTeamMembers
                    teamMembers={teamMembers}
                    invitations={teamMembersInvitations}
                    currentTablePage={currentTablePage}
                    setCurrentTablePage={setCurrentTablePage}
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
        </>
    );
};

export default UsersTeamMembersIndex;
