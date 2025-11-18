/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Header from '@app/components/header/header';
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import Page from '@app/components/page/page';
import ProjectItem from '@app/components/project/project-item';
import ProjectItemButton from '@app/components/project/project-item-button';
import Modal from '@app/components/modal/modal';
import ModalAddProject from '@app/domain/project/components/modal-add-project/modal-add-project';
import ModalConfirmTaskGroup from '@app/domain/task-group/components/modal-confirm-task-group/modal-confirm-task-group';
import ModalLimit from '@app/components/modal/modal-limit';
import plus from '@/images/plus.png';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';

const ProjectsIndex = () => {
    const [searchParams] = useSearchParams();

    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isConfirmTaskGroupModalOpen, setIsConfirmTaskGroupModalOpen] =
        useState(Boolean(searchParams.get('newly-created-project')));
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { isUserLoggedIn, authUser, canCreateProjects } =
        usePermissionsContextApi();
    const { projects } = useQueryContextApi();

    const { state, pathname } = useLocation();
    const navigate = useNavigate();

    const closeModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddProjectModalOpen(false);
            setIsConfirmTaskGroupModalOpen(false);
        }
    };

    useEffect(() => {
        if (state?.currentlySubscribed) {
            navigate(pathname, { replace: true });
            canCreateProjects
                ? setIsAddProjectModalOpen(true)
                : setIsLimitModalOpen(true);
        }
    }, []);

    return (
        <BaseLayout>
            <Header showHeaderSelect />
            <Subheader color="gray">
                <Subheader.Left title="Projects" />
                {isUserLoggedIn && authUser?.has_plan && (
                    <Subheader.Right>
                        <Button
                            type="button"
                            modifier="add-record no-border"
                            icon
                            onClick={() => {
                                canCreateProjects
                                    ? setIsAddProjectModalOpen(true)
                                    : setIsLimitModalOpen(true);
                            }}
                        >
                            Add New
                        </Button>
                    </Subheader.Right>
                )}
            </Subheader>
            <Page upper color="gray">
                <div className="table-overflow">
                    <div className="table-overflow__inner">
                        <div className="project__items-holder">
                            {projects.map((item) => (
                                <ProjectItem
                                    key={item.id}
                                    project={item}
                                    openAlertBox={openAlertBox}
                                    setOpenAlertBox={setOpenAlertBox}
                                />
                            ))}
                            {isUserLoggedIn && authUser?.has_plan && (
                                <ProjectItemButton
                                    larger
                                    color="gray"
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Add New Project"
                                    data-tooltip-float
                                    data-tooltip-variant="light"
                                    data-tooltip-place="bottom"
                                    onClick={() => {
                                        canCreateProjects
                                            ? setIsAddProjectModalOpen(true)
                                            : setIsLimitModalOpen(true);
                                    }}
                                >
                                    <img
                                        src={plus}
                                        alt="Button Add Project"
                                        width="24px"
                                        height="24px"
                                    />
                                </ProjectItemButton>
                            )}
                        </div>
                    </div>
                </div>
            </Page>
            {isAddProjectModalOpen && (
                <Modal
                    larger
                    className="full-height"
                    modalIsOpen={isAddProjectModalOpen}
                    setIsModalOpen={setIsAddProjectModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={closeModal}
                    disableOutsideClick
                >
                    <ModalAddProject
                        closeModal={closeModal}
                        setIsFormChanged={setIsFormChanged}
                    />
                </Modal>
            )}
            {isConfirmTaskGroupModalOpen && (
                <Modal
                    className="full-height"
                    modifier="confirm"
                    modalIsOpen={isConfirmTaskGroupModalOpen}
                    closeModal={closeModal}
                    disableOutsideClick
                >
                    <ModalConfirmTaskGroup closeModal={closeModal} />
                </Modal>
            )}
            {isLimitModalOpen && (
                <ModalLimit
                    isOpen={isLimitModalOpen}
                    setIsOpen={setIsLimitModalOpen}
                    type="projects"
                />
            )}
        </BaseLayout>
    );
};

export default ProjectsIndex;
