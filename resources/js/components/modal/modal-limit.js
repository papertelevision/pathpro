/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import ProjectLimitPng from '@/images/projects-limit.png';
import TeamMembersLimitPng from '@/images/team-members-limit.png';
import CommunityMembersLimitPng from '@/images/community-members-limit.png';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { createCookie, eraseCookie, readCookie } from '@app/lib/cookies';

const data = {
    projects: [
        <img key="img" src={ProjectLimitPng} alt="Projects Limit Icon" />,
        <h4 key="title">Looks Like You’re Growing!</h4>,
        <p key="text">
            You’ve created as many Projects/Products as your current plan
            allows, but hey, that must mean you’re growing! To add more
            Projects/Products, you’ll need to upgrade your plan. Check them out
            below!
        </p>,
    ],
    teamMembers: [
        <img
            key="img"
            src={TeamMembersLimitPng}
            alt="Team Members Limit Icon"
        />,
        <h4 key="title">It’s Getting Crowded In Here!</h4>,
        <p key="text">
            You’ve reached the limit on how many Team Members can be
            invited/added to this account. Congrats on the growth! To add more
            Team Members, you’ll need to upgrade your plan. Check them out
            below!
        </p>,
    ],
    communityMembers: [
        <img
            key="img"
            src={CommunityMembersLimitPng}
            alt="Community Members Limit Icon"
        />,
        <h4 key="title">Wow, Your Community is Growing!</h4>,
        <p key="text">
            Demand for your Product(s) has grown so much that you’ve exceeded
            the amount of Community Members allowed for your plan. To ensure
            that your community can continue to grow, you’ll need to upgrade
            your plan. Check them out below!
        </p>,
    ],
};

const ModalLimit = ({ isOpen, setIsOpen, type }) => {
    const navigate = useNavigate();
    const { authUser } = usePermissionsContextApi();

    useEffect(() => {
        type === 'communityMembers' &&
            setIsOpen(
                readCookie('snooze-limit-modal') === null &&
                    !authUser.can_have_community_members
            );
    }, [authUser]);

    return (
        <Modal
            disableOutsideClick
            className="full-height"
            modifier="limit"
            modalIsOpen={isOpen}
            setIsModalOpen={setIsOpen}
            closeModal={() => setIsOpen(false)}
        >
            <Modal.Content>
                <div className="modal__content-wrapper">
                    <div className="modal__content-text">{data[type]}</div>
                    <div className="modal__content-button-wrapper">
                        <Button
                            type="button"
                            modifier="rectangular"
                            color="is-blue"
                            onClick={() => navigate('/account')}
                        >
                            Go To Plan Details
                        </Button>
                        <Button
                            type="button"
                            color="red-text"
                            onClick={() => setIsOpen(false)}
                        >
                            Close This Window
                        </Button>
                    </div>
                    {type === 'communityMembers' && (
                        <div className="modal__content-actions">
                            <div className="modal__checkbox">
                                <input
                                    id="snooze"
                                    type="checkbox"
                                    onChange={(e) =>
                                        e.target.checked
                                            ? createCookie(
                                                  'snooze-limit-modal',
                                                  true,
                                                  5
                                              )
                                            : eraseCookie('snooze-limit-modal')
                                    }
                                />
                                <label htmlFor="snooze">
                                    Snooze this message for 5 days
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default ModalLimit;
