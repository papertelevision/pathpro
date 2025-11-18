/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormInviteTeamMember from '@app/domain/user/components/form-invite-team-member/form-invite-team-member';
import SectionStripeProducts from '@app/domain/stripe/components/section-stripe-products/section-stripe-products';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const FormModalInviteTeamMember = ({ project }) => {
    const [isInviteTeamMemberModalOpen, setIsInviteTeamMemberModalOpen] =
        useState(false);
    const [isEditStripeProductModalOpen, setIsEditStripeProductModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const { authUser, canAssignTeamMembers } = usePermissionsContextApi();

    const closeInviteTeamMemberModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsInviteTeamMemberModalOpen(false);
        }
    };

    return (
        <>
            <div className="form__text">
                {canAssignTeamMembers ? (
                    <i>
                        Not seeing your Team Members in the above list? You can{' '}
                        <button
                            type="button"
                            onClick={() => setIsInviteTeamMemberModalOpen(true)}
                        >
                            invite new Team Members / Collaborators here.
                        </button>
                    </i>
                ) : (
                    <i>
                        You have reached the Team Members limit included in your
                        PathPro plan!{' '}
                        <button
                            type="button"
                            onClick={() =>
                                setIsEditStripeProductModalOpen(true)
                            }
                        >
                            Upgrade it from here
                        </button>{' '}
                        to invite more.
                    </i>
                )}
            </div>

            {canAssignTeamMembers && (
                <Modal
                    medium
                    className="full-height"
                    modalIsOpen={isInviteTeamMemberModalOpen}
                    setIsModalOpen={setIsInviteTeamMemberModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={closeInviteTeamMemberModal}
                >
                    <Modal.Content>
                        <Modal.Header closeModal={closeInviteTeamMemberModal}>
                            <div className="modal__header-left">
                                Invite Team Member
                            </div>
                        </Modal.Header>
                        <FormInviteTeamMember
                            closeModal={closeInviteTeamMemberModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsInviteTeamMemberModalOpen={
                                setIsInviteTeamMemberModalOpen
                            }
                            currentTablePage={1}
                            project={project}
                        />
                    </Modal.Content>
                </Modal>
            )}

            {authUser.plan?.is_provider_stripe && !canAssignTeamMembers && (
                <Modal
                    modifier="stripe-products"
                    modalIsOpen={isEditStripeProductModalOpen}
                    setIsModalOpen={setIsEditStripeProductModalOpen}
                    closeModal={() => setIsEditStripeProductModalOpen(false)}
                >
                    <Modal.Content>
                        <Modal.Header
                            className="is-white"
                            closeModal={() =>
                                setIsEditStripeProductModalOpen(false)
                            }
                        >
                            <div className="modal__header-left"></div>
                        </Modal.Header>
                        <SectionStripeProducts />
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
};

export default FormModalInviteTeamMember;
