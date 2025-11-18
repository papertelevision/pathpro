/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import BoxButtonShare from '@app/components/box/box-button-share';
import Page from '@app/components/page/page';
import Icon from '@app/components/icon/icon';
import Modal from '@app/components/modal/modal';
import ModalShowNews from '@app/domain/news/components/modal-show-news/modal-show-news';
import ModalAddSubmission from '@app/domain/submission/components/modal-add-submission/modal-add-submission';
import FormAddReleaseNotes from '@app/domain/release-note/components/form-add-release-notes/form-add-release-notes';
import TableProjectReleaseNotes from '@app/domain/release-note/components/table-project-release-notes/table-project-release-notes';
import Accordion from '@app/components/accordion/accordion';
import ReleaseNote from '@app/domain/release-note/components/release-note/release-note';
import Loader from '@app/components/loader/loader';
import useProjectReleaseNotesIndexQuery from '@app/data/project/use-project-release-notes-index-query';
import useProjectReleaseNotesAuthorsIndexQuery from '@app/data/project/use-project-release-notes-authors-index-query';
import useProjectReleaseNotesInfinityIndexQuery from '@app/data/project/use-project-release-notes-infinite-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import Header from '@app/components/header/header';

const ProjectReleaseNotesPage = ({ project }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });
    const { publicNewsId } = useParams();

    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [currentTableFilterValue, setCurrentTableFilterValue] = useState();
    const [isAddReleaseNotesModalOpen, setIsAddReleaseNotesModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(!!publicNewsId);
    const [isAddSubmissionModalOpen, setIsAddSubmissionModalOpen] =
        useState(false);

    const {
        isUserLoggedIn,
        isAuthUserCommunityMember,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAssignToProject,
        canUpdateReleaseNotes,
    } = usePermissionsContextApi();

    const {
        isLoading: isProjectReleaseNotesDataLoading,
        data: projectReleaseNotesData,
    } = useProjectReleaseNotesIndexQuery(
        project.slug,
        currentTablePage,
        queryArgs,
        {
            enabled:
                isUserLoggedIn &&
                !isAuthUserCommunityMember(project.id) &&
                isAuthUserAssignToProject(project.id),
        }
    );

    const {
        isLoading: isProjectReleaseNotesDataInfinityQryLoading,
        data: projectReleaseNotesDataInfinityQry,
        fetchNextPage,
    } = useProjectReleaseNotesInfinityIndexQuery(project.slug, queryArgs, {
        enabled:
            !isUserLoggedIn ||
            isAuthUserCommunityMember(project.id) ||
            !isAuthUserAssignToProject(project.id),
    });

    const {
        isLoading: isProjectReleaseNotesAuthorsDataLoading,
        data: projectReleaseNotesAuthorsData,
    } = useProjectReleaseNotesAuthorsIndexQuery(project.id);

    const closeAddReleaseNotesModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddReleaseNotesModalOpen(false);
        }
    };

    const releaseNotes = (
        projectReleaseNotesDataInfinityQry?.pages || []
    ).reduce((memo, page) => {
        memo = [...memo, ...page.data.data];

        return memo;
    }, []);

    useEffect(() => {
        const filterValueAuthor = {
            label: qs.parse(location?.search, {
                ignoreQueryPrefix: true,
            })?.author,
            value: qs.parse(location?.search, {
                ignoreQueryPrefix: true,
            })?.author,
        };

        const filterValueAll = {
            label: 'All',
            value: 'All',
        };

        setCurrentTableFilterValue(
            location.search ? filterValueAuthor : filterValueAll
        );
    }, [location]);

    if (
        isProjectReleaseNotesDataLoading ||
        isProjectReleaseNotesAuthorsDataLoading ||
        isProjectReleaseNotesDataInfinityQryLoading
    ) {
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
                    {project?.tabs.find((tab) => tab.value === 'releaseNotes')
                        ?.label || 'Release Notes'}
                </Subheader.Left>

                <Subheader.Right>
                    <BoxButtonShare
                        place="bottom"
                        page="release-notes"
                        className="share"
                        shareObject="project"
                        shareUrl={project.slug}
                    />
                    {isUserLoggedIn && canUpdateReleaseNotes(project.id) && (
                        <Button
                            type="button"
                            modifier="add-record"
                            icon
                            onClick={() => setIsAddReleaseNotesModalOpen(true)}
                        >
                            Add Release
                        </Button>
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
            {isUserLoggedIn &&
            !isAuthUserCommunityMember(project.id) &&
            isAuthUserAssignToProject(project.id) ? (
                <Page upper color="gray">
                    <TableProjectReleaseNotes
                        releaseNotes={projectReleaseNotesData}
                        releaseNotesAuthors={projectReleaseNotesAuthorsData}
                        project={project}
                        currentTablePage={currentTablePage}
                        setCurrentTablePage={setCurrentTablePage}
                        currentTableFilterValue={currentTableFilterValue}
                        setCurrentTableFilterValue={setCurrentTableFilterValue}
                    />
                </Page>
            ) : (
                <Page color="gray">
                    {releaseNotes.length > 0 ? (
                        <InfiniteScroll
                            dataLength={
                                projectReleaseNotesDataInfinityQry?.pages
                                    .length * 10
                            }
                            scrollableTarget="page__content"
                            hasMore={true}
                            loader={
                                projectReleaseNotesDataInfinityQry?.pages[0]
                                    .data.meta.total > releaseNotes.length && (
                                    <button
                                        onClick={fetchNextPage}
                                        className="infinite-scroll-component__loader-button"
                                    >
                                        Load Older Release Notes
                                    </button>
                                )
                            }
                        >
                            <Accordion active modifier="release-notes">
                                {releaseNotes.map((releaseNote, idx) => (
                                    <ReleaseNote
                                        index={idx}
                                        key={releaseNote.id}
                                        releaseNote={releaseNote}
                                        project={project}
                                    />
                                ))}
                            </Accordion>
                        </InfiniteScroll>
                    ) : (
                        <p>No release notes yet!</p>
                    )}
                </Page>
            )}

            <Modal
                className="full-height"
                modalIsOpen={isAddReleaseNotesModalOpen}
                setIsModalOpen={setIsAddReleaseNotesModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeAddReleaseNotesModal}
            >
                <Modal.Content>
                    <FormAddReleaseNotes
                        project={project}
                        closeModal={closeAddReleaseNotesModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddReleaseNotesModalOpen={
                            setIsAddReleaseNotesModalOpen
                        }
                        currentTablePage={currentTablePage}
                    />
                </Modal.Content>
            </Modal>
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

export default ProjectReleaseNotesPage;
