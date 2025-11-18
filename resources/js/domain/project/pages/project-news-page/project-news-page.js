/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import BoxButtonShare from '@app/components/box/box-button-share';
import Page from '@app/components/page/page';
import Icon from '@app/components/icon/icon';
import Modal from '@app/components/modal/modal';
import FormAddNewsUpdate from '@app/domain/news/components/form-add-news-update/form-add-news-update';
import TableProjectNews from '@app/domain/news/components/table-project-news/table-project-news';
import Loader from '@app/components/loader/loader';
import useProjectNewsIndexQuery from '@app/data/project/use-project-news-index-query';
import useProjectNewsAuthorsIndexQuery from '@app/data/project/use-project-news-authors-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import Header from '@app/components/header/header';

const ProjectNewsPage = ({ project }) => {
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [currentTableFilterValue, setCurrentTableFilterValue] = useState();
    const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const { canEditProductNews } = usePermissionsContextApi();
    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const { isLoading: isNewsDataLoading, data: news } =
        useProjectNewsIndexQuery(project.slug, currentTablePage, queryArgs);
    const {
        isLoading: isProjectNewsAuthorsDataLoading,
        data: projectNewsAuthorsData,
    } = useProjectNewsAuthorsIndexQuery(project.id);

    const closeAddNewsModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddNewsModalOpen(false);
        }
    };

    useEffect(() => {
        const filterValueAuthor = {
            label: parse(location?.search, {
                ignoreQueryPrefix: true,
            })?.author,
            value: parse(location?.search, {
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

    if (isNewsDataLoading || isProjectNewsAuthorsDataLoading) {
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
                    {project?.tabs.find((tab) => tab.value === 'projectNews')
                        ?.label || 'Project News'}
                </Subheader.Left>

                <Subheader.Right>
                    <BoxButtonShare
                        place="bottom"
                        page="news"
                        className="share"
                        shareObject="project"
                        shareUrl={project.slug}
                    />
                    {canEditProductNews(project.id) && (
                        <Button
                            type="button"
                            modifier="add-record"
                            icon
                            onClick={() => setIsAddNewsModalOpen(true)}
                        >
                            Add News Update
                        </Button>
                    )}
                </Subheader.Right>
            </Subheader>

            <Page upper color="gray">
                <TableProjectNews
                    news={news}
                    project={project}
                    newsAuthors={projectNewsAuthorsData}
                    currentTablePage={currentTablePage}
                    setCurrentTablePage={setCurrentTablePage}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                />
            </Page>

            <Modal
                className="full-height"
                modalIsOpen={isAddNewsModalOpen}
                setIsModalOpen={setIsAddNewsModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeAddNewsModal}
            >
                <Modal.Content>
                    <FormAddNewsUpdate
                        closeModal={closeAddNewsModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddNewsModalOpen={setIsAddNewsModalOpen}
                        currentTablePage={currentTablePage}
                    />
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default ProjectNewsPage;
