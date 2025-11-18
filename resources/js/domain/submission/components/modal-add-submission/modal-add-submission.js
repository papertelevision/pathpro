/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormAddPublicSubmission from '@app/domain/submission/components/form-add-public-submission/form-add-public-submission';
import Icon from '@app/components/icon/icon';
import Button from '@app/components/button/button';
import useProjectCommunityMemberStoreMutation from '@app/data/project/use-project-community-member-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const ModalAddSubmission = ({
    isOpen = false,
    setIsOpen = () => {},
    project,
}) => {
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const { isUserLoggedIn, isAuthUserAssignToProject } =
        usePermissionsContextApi();

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { mutate: mutateCommunityMemberStore } =
        useProjectCommunityMemberStoreMutation(project.slug);

    const handleCloseModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isOpen)
            setTimeout(() => {
                setShowForm(true);
            }, 150);
    }, [isOpen]);

    return isUserLoggedIn && isAuthUserAssignToProject(project.id) ? (
        <Modal
            modifier="public"
            className="full-height"
            closeModal={handleCloseModal}
            modalIsOpen={isOpen}
            setIsModalOpen={setIsOpen}
            setOpenAlertBox={setOpenAlertBox}
            isAlertBoxActive={openAlertBox}
        >
            {showForm ? (
                <Modal.Content>
                    <Modal.Header closeModal={handleCloseModal}>
                        <div className="modal__header-title">
                            <h1>Have some feedback? Tell us about it!</h1>
                        </div>
                    </Modal.Header>
                    <FormAddPublicSubmission
                        project={project}
                        closeModal={handleCloseModal}
                        onSuccess={() => setShowForm(false)}
                        setIsFormChanged={setIsFormChanged}
                    />
                </Modal.Content>
            ) : (
                <Modal.Content>
                    <Modal.Header closeModal={() => setIsOpen(false)}>
                        <div className="modal__header-left"></div>
                    </Modal.Header>
                    <div className="modal__content-wrapper">
                        <div className="modal__content-icon">
                            <Icon type="high_five" />
                        </div>
                        <div className="modal__content-text">
                            <h3>Feature Suggestion Sent!</h3>
                            <p>
                                Thanks for the idea, we're sure it's awesome!
                                We'll be sure to review it in-depth and, if we
                                feel it's a good fit, you just might see it as a
                                new feature! Again, big thanks from our team for
                                contributing to the vision!
                            </p>
                        </div>
                        <Button
                            type="button"
                            color="blue"
                            rounded
                            larger
                            onClick={() => setIsOpen(false)}
                        >
                            Close this Window
                        </Button>
                    </div>
                </Modal.Content>
            )}
        </Modal>
    ) : (
        <Modal
            medium
            className="full-height"
            modalIsOpen={isOpen}
            setIsModalOpen={setIsOpen}
            closeModal={() => setIsOpen(false)}
        >
            <Modal.Content>
                <Modal.Header
                    className="is-white"
                    closeModal={() => setIsOpen(false)}
                >
                    <div className="modal__header-left"></div>
                </Modal.Header>
                <div className="modal__content-wrapper">
                    <div className="modal__content-text">
                        <p>
                            {isUserLoggedIn
                                ? 'You must join the project as a community member in order to interact with it.'
                                : 'You must create a free community member account or log in to an existing one to interact with this project.'}
                        </p>
                    </div>
                    {project?.creator.can_have_community_members && (
                        <div className="modal__content-button-wrapper">
                            {isUserLoggedIn ? (
                                <Button
                                    type="button"
                                    color="blue"
                                    rounded
                                    larger
                                    onClick={() => mutateCommunityMemberStore()}
                                >
                                    Join Here 100% Free
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        color="blue"
                                        rounded
                                        larger
                                        onClick={() =>
                                            navigate('/login', {
                                                state: { redirectTo: pathname },
                                            })
                                        }
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        type="button"
                                        color="blue"
                                        rounded
                                        larger
                                        onClick={() =>
                                            navigate(
                                                `/register/${projectSlug}`,
                                                {
                                                    state: {
                                                        redirectTo: pathname,
                                                    },
                                                }
                                            )
                                        }
                                    >
                                        Join Here 100% Free
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default ModalAddSubmission;
