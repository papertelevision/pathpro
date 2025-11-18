/**
 * External dependencies
 */
import { React, Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ProjectItemGroup from '@app/components/project/project-item-group';
import ProjectItemButton from '@app/components/project/project-item-button';
import ButtonIconTeam from '@/images/button_icon_team@2x.png';
import IconIframe from '@/images/icon_iframe.png';
import ButtonIconContributors from '@/images/button_icon_contributors@2x.png';
import BoxButtonShare from '@app/components/box/box-button-share';
import Modal from '@app/components/modal/modal';
import ModalEditProject from '@app/domain/project/components/modal-edit-project/modal-edit-project';
import Dots from '@app/components/dots/dots';
import Icon from '@app/components/icon/icon';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import { useSubdomain } from '@app/lib/domain';
import { dateFormat } from '@app/lib/date-format';

const ProjectItem = ({ project, openAlertBox, setOpenAlertBox }) => {
    const navigate = useNavigate();
    const { selectedValue } = useHeaderSelectContext();
    const {
        canUpdateProject,
        isAuthUserCommunityMember,
        isAuthUserAdmitOrTeamMember,
    } = usePermissionsContextApi();
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const areActionButtonsDisabled = !canUpdateProject(project.id);

    const closeEditProjectModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditProjectModalOpen(false);
            navigate('/projects');
        }
    };

    return (
        <Fragment>
            <div
                className={classNames('project__item', {
                    'is-green-bordered': project.slug === selectedValue,
                })}
            >
                <div className="project__item-inner">
                    <div className="project__item-left">
                        <div className="project__item-title">
                            <NavLink
                                to={useSubdomain(project.slug)}
                                target="_blank"
                            >
                                <span>{project.title}</span>
                                <Icon type="tab" />
                            </NavLink>
                        </div>
                        <span>
                            Updated:{' '}
                            {dateFormat(
                                project.updated_at,
                                project.date_format,
                                false,
                                false,
                                '/'
                            )}
                        </span>
                    </div>

                    <div className="project__item-right">
                        {!isAuthUserCommunityMember(project.id) && (
                            <ProjectItemGroup>
                                <NavLink
                                    to={useSubdomain(
                                        project.slug,
                                        'submissions'
                                    )}
                                    className="project__item-link"
                                >
                                    Submissions
                                </NavLink>
                                {project.new_submissions_count > 0 && (
                                    <div className="circle">
                                        {project.new_submissions_count}
                                    </div>
                                )}
                            </ProjectItemGroup>
                        )}
                        {(isAuthUserAdmitOrTeamMember(project.id) ||
                            (isAuthUserCommunityMember(project.id) &&
                                project.features_count > 0)) && (
                            <ProjectItemGroup>
                                <NavLink
                                    to={useSubdomain(project.slug, 'features')}
                                    className="project__item-link"
                                >
                                    {project?.tabs.find(
                                        (tab) => tab.value === 'featureVoting'
                                    )?.label || 'Feature Voting'}
                                </NavLink>
                            </ProjectItemGroup>
                        )}
                        <ProjectItemGroup>
                            <NavLink
                                to={useSubdomain(project.slug)}
                                className="project__item-link"
                            >
                                {project?.tabs.find(
                                    (tab) => tab.value === 'roadmap'
                                )?.label || 'Roadmap'}
                            </NavLink>
                        </ProjectItemGroup>
                        {(isAuthUserAdmitOrTeamMember(project.id) ||
                            (isAuthUserCommunityMember(project.id) &&
                                project.features_count > 0)) && (
                            <ProjectItemGroup>
                                <NavLink
                                    to={useSubdomain(
                                        project.slug,
                                        'release-notes'
                                    )}
                                    className="project__item-link"
                                >
                                    {project?.tabs.find(
                                        (tab) => tab.value === 'releaseNotes'
                                    )?.label || 'Release Notes'}
                                </NavLink>
                            </ProjectItemGroup>
                        )}
                        <div className="project__item-groups">
                            {!isAuthUserCommunityMember(project.id) && (
                                <ProjectItemGroup
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Team Members"
                                    data-tooltip-place="bottom"
                                    data-tooltip-variant="light"
                                >
                                    <NavLink
                                        to={
                                            areActionButtonsDisabled
                                                ? ''
                                                : useSubdomain(
                                                      project.slug,
                                                      'team-members'
                                                  )
                                        }
                                        className={`project__item-group-link ${
                                            areActionButtonsDisabled &&
                                            'disabled pointer-events-none'
                                        }`}
                                    >
                                        <ProjectItemButton>
                                            <img
                                                src={ButtonIconTeam}
                                                alt="ButtonIconTeam"
                                                width="33"
                                                height="17"
                                            />
                                            <span className="product__item-text">
                                                {project.team_members_count}
                                            </span>
                                        </ProjectItemButton>
                                    </NavLink>
                                </ProjectItemGroup>
                            )}
                            {!isAuthUserCommunityMember(project.id) && (
                                <ProjectItemGroup
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Community Members"
                                    data-tooltip-place="bottom"
                                    data-tooltip-variant="light"
                                >
                                    <NavLink
                                        to={
                                            areActionButtonsDisabled
                                                ? ''
                                                : useSubdomain(
                                                      project.slug,
                                                      'community-members'
                                                  )
                                        }
                                        className={`project__item-group-link ${
                                            areActionButtonsDisabled &&
                                            'disabled pointer-events-none'
                                        }`}
                                    >
                                        <ProjectItemButton>
                                            <img
                                                src={ButtonIconContributors}
                                                alt="ButtonIconContributors"
                                                width="18"
                                                height="22"
                                            />
                                            <span className="product__item-text">
                                                {
                                                    project.community_members
                                                        ?.length
                                                }
                                            </span>
                                        </ProjectItemButton>
                                    </NavLink>
                                </ProjectItemGroup>
                            )}
                            <ProjectItemGroup>
                                <BoxButtonShare
                                    className="project__item-button"
                                    shareObject="project"
                                    shareUrl={project.slug}
                                    type="light"
                                    place="bottom"
                                    data-tooltip-attr="share"
                                />
                            </ProjectItemGroup>
                            {!areActionButtonsDisabled && (
                                <ProjectItemGroup
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Embed Project on your site"
                                    data-tooltip-place="bottom"
                                    data-tooltip-variant="light"
                                >
                                    <ProjectItemButton
                                        onClick={() => {
                                            const copy = require('clipboard-copy');
                                            copy(
                                                `<iframe src="${useSubdomain(
                                                    project.slug
                                                )}" height='100%' width='100%'></iframe>`
                                            );
                                            setIsPopupNotificationVisible(true);
                                            setPopupNotificationText(
                                                'Embed code generated!'
                                            );
                                        }}
                                    >
                                        <img
                                            src={IconIframe}
                                            alt="Icon Iframe"
                                            width="35"
                                            height="30"
                                        />
                                    </ProjectItemButton>
                                </ProjectItemGroup>
                            )}
                            <ProjectItemGroup
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Settings"
                                data-tooltip-place="bottom"
                                data-tooltip-variant="light"
                            >
                                {!areActionButtonsDisabled && (
                                    <ProjectItemButton
                                        onClick={() =>
                                            setIsEditProjectModalOpen(true)
                                        }
                                    >
                                        <Dots />
                                    </ProjectItemButton>
                                )}
                            </ProjectItemGroup>
                        </div>
                    </div>
                </div>
            </div>
            {!areActionButtonsDisabled && (
                <Modal
                    larger
                    className="full-height"
                    modalIsOpen={isEditProjectModalOpen}
                    setIsModalOpen={setIsEditProjectModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={closeEditProjectModal}
                    urlAddress="/"
                >
                    <ModalEditProject
                        project={project}
                        setIsFormChanged={setIsFormChanged}
                        closeEditProjectModal={closeEditProjectModal}
                        setIsEditProjectModalOpen={setIsEditProjectModalOpen}
                        isEditProjectModalOpen={isEditProjectModalOpen}
                    />
                </Modal>
            )}
        </Fragment>
    );
};

export default ProjectItem;
