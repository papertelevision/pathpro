/**
 * External dependencies
 */
import React, { Fragment, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Select from 'react-select';
import qs from 'qs';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import TaskGroupDragAndDrop from '@app/domain/task-group/components/task-group-drag-and-drop/task-group-drag-and-drop';
import Button from '@app/components/button/button';
import BoxButton from '@app/components/box/box-button';
import BoxButtonShare from '@app/components/box/box-button-share';
import Icon from '@app/components/icon/icon';
import Loader from '@app/components/loader/loader';
import Modal from '@app/components/modal/modal';
import ModalAddTaskGroup from '@app/domain/task-group/components/modal-add-task-group/modal-add-task-group';
import ModalAddTask from '@app/domain/task/components/modal-add-task/modal-add-task';
import ModalConfirmTask from '@app/domain/task/components/modal-confirm-task/modal-confirm-task';
import ModalShowNews from '@app/domain/news/components/modal-show-news/modal-show-news';
import ModalAddSubmission from '@app/domain/submission/components/modal-add-submission/modal-add-submission';
import ModalConfirmDiscoverMore from '@app/components/modal/modal-confirm-discover-more';
import Filter from '@app/components/filter/filter';
import folder from '@/images/folder.png';
import useProjectTaskGroupsIndexQuery from '@app/data/project/use-project-task-groups-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import Header from '@app/components/header/header';

const ProjectTaskGroupsPage = ({ project }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });
    const { publicNewsId } = useParams();
    const openModal = Boolean(Cookies.get('openModal'));

    const [formIndex, setFormIndex] = useState(1);
    const [isAddTaskGroupModalOpen, setIsAddTaskGroupModalOpen] =
        useState(openModal);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(!!publicNewsId);
    const [isAddSubmissionModalOpen, setIsAddSubmissionModalOpen] =
        useState(false);
    const [filterValue, setFilterValue] = useState();
    const pageRef = useRef(null);

    const { taskGroupVisibilities: visibilities } = useQueryContextApi();
    const {
        canCreateEditTaskGroups,
        isUserLoggedIn,
        isAuthUserAdmitOrTeamMember,
    } = usePermissionsContextApi();

    const { isLoading: isDataLoading, data } = useProjectTaskGroupsIndexQuery(
        project.slug,
        queryArgs
    );

    const handleCloseModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            Cookies.remove('openModal');
            setFormIndex(0);
            setIsAddTaskGroupModalOpen(false);
            setIsAddTaskModalOpen(false);
        }
    };

    const handleOpenTaskGroupModal = () => {
        setFormIndex(1);
        setIsAddTaskGroupModalOpen(true);
    };

    const handleOnChangeSelect = (e) => {
        if (e.value === 1) {
            handleOpenTaskGroupModal();
        } else {
            setFormIndex(5);
            setIsAddTaskModalOpen(true);
        }
    };

    if (isDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <Fragment>
            <Header showHeaderSelect />
            <Subheader>
                <Subheader.Left
                    title={project.title}
                    icon={
                        project.is_description_public && (
                            <Icon
                                type="info"
                                data-tooltip-id="tooltip"
                                data-tooltip-html={`<div class="react-tooltip--project">${project.description}</div>`}
                                data-tooltip-place="bottom"
                                data-tooltip-variant="light"
                                data-tooltip-float
                            />
                        )
                    }
                    separator
                >
                    {project?.tabs.find((tab) => tab.value === 'roadmap')
                        ?.label || 'Roadmap'}
                </Subheader.Left>
                <Subheader.Right>
                    {isAuthUserAdmitOrTeamMember(project.id) && (
                        <Filter
                            type="visibility"
                            data={visibilities}
                            filterValue={filterValue}
                            setFilterValue={setFilterValue}
                            tooltipText="Filter groups by visibility"
                        />
                    )}
                    <BoxButtonShare
                        place="bottom"
                        className="share"
                        shareObject="project"
                        shareUrl={project.slug}
                    />
                    {canCreateEditTaskGroups(project.id) && isUserLoggedIn && (
                        <Select
                            value="Add New"
                            placeholder="Add New"
                            classNamePrefix="subheader-select-field"
                            dropdownIndicator={false}
                            options={[
                                { value: 1, label: 'Task Group' },
                                ...(data.groups.length > 0
                                    ? [{ value: 2, label: 'Feature/Idea/Task' }]
                                    : []),
                            ]}
                            onChange={handleOnChangeSelect}
                            isSearchable={false}
                            menuPlacement="auto"
                        />
                    )}
                    {(!isUserLoggedIn ||
                        !isAuthUserAdmitOrTeamMember(project.id)) &&
                        (project.latest_news_update ||
                            (project.are_feature_submissions_allowed &&
                                project?.creator
                                    .can_have_community_members)) && (
                            <div className="subheader__actions">
                                {project.latest_news_update && (
                                    <Button
                                        type="button"
                                        rounded
                                        color="white"
                                        onClick={() => {
                                            setIsNewsModalOpen(true);
                                            navigate(
                                                `${location.pathname}/public-news/${project.latest_news_update.id}`,
                                                {
                                                    replace: true,
                                                }
                                            );
                                        }}
                                    >
                                        {
                                            project?.tabs.find(
                                                (tab) =>
                                                    tab.value === 'projectNews'
                                            )?.label
                                        }
                                    </Button>
                                )}
                                {project.are_feature_submissions_allowed &&
                                    project?.creator
                                        .can_have_community_members && (
                                        <Button
                                            type="button"
                                            rounded
                                            color="white"
                                            onClick={() =>
                                                setIsAddSubmissionModalOpen(
                                                    true
                                                )
                                            }
                                        >
                                            {
                                                project.submit_feedback_button_text
                                            }
                                        </Button>
                                    )}
                            </div>
                        )}
                </Subheader.Right>
            </Subheader>

            <Page modifier="roadmap" color="gray" ref={pageRef}>
                <div className="groups">
                    {data.groups.length > 0 && (
                        <TaskGroupDragAndDrop
                            types={data.types}
                            groups={data.groups}
                            project={project}
                            statuses={data.statuses}
                            filterValue={filterValue}
                        />
                    )}
                    {canCreateEditTaskGroups(project.id) && (
                        <div className="groups__actions">
                            <BoxButton
                                modifier="img"
                                onClick={handleOpenTaskGroupModal}
                            >
                                <img src={folder} alt="folder" />
                                Add Task Group
                            </BoxButton>
                        </div>
                    )}
                </div>
            </Page>
            {isAddTaskGroupModalOpen && (
                <Modal
                    className="full-height"
                    modalIsOpen={isAddTaskGroupModalOpen}
                    setIsModalOpen={setIsAddTaskGroupModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={handleCloseModal}
                    disableOutsideClick
                >
                    <ModalAddTaskGroup
                        project={project}
                        handleFormState={openModal ? setFormIndex : () => {}}
                        closeModal={handleCloseModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddTaskGroupModalOpen={setIsAddTaskGroupModalOpen}
                    />
                </Modal>
            )}
            {formIndex === 2 && (
                <Modal
                    className="full-height"
                    modifier="confirm"
                    modalIsOpen
                    closeModal={handleCloseModal}
                    disableOutsideClick
                >
                    <ModalConfirmTask
                        closeModal={handleCloseModal}
                        handleFormState={setFormIndex}
                        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                    />
                </Modal>
            )}
            {(formIndex === 3 || formIndex === 5) && (
                <Modal
                    className="full-height"
                    modalIsOpen={isAddTaskModalOpen}
                    setFormIndexToThree={setFormIndex}
                    setIsModalOpen={setIsAddTaskModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={handleCloseModal}
                    disableOutsideClick
                >
                    <ModalAddTask
                        taskStatuses={data.statuses}
                        taskTypes={data.types}
                        project={project}
                        closeModal={handleCloseModal}
                        handleFormState={setFormIndex}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                    />
                </Modal>
            )}
            {formIndex === 4 && (
                <Modal
                    className="full-height"
                    modifier="confirm"
                    modalIsOpen
                    closeModal={handleCloseModal}
                    disableOutsideClick
                >
                    <ModalConfirmDiscoverMore closeModal={handleCloseModal} />
                </Modal>
            )}
            {project.latest_news_update && (
                <ModalShowNews
                    isOpen={isNewsModalOpen}
                    setIsOpen={setIsNewsModalOpen}
                    project={project}
                />
            )}
            {(!isAuthUserAdmitOrTeamMember(project.id) || !isUserLoggedIn) &&
                project.are_feature_submissions_allowed && (
                    <ModalAddSubmission
                        isOpen={isAddSubmissionModalOpen}
                        setIsOpen={setIsAddSubmissionModalOpen}
                        project={project}
                    />
                )}
        </Fragment>
    );
};

export default ProjectTaskGroupsPage;
