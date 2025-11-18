/**
 * External dependencies
 */
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Loader from '@app/components/loader/loader';
import ProjectHeader from '@app/domain/header/components/project-header';
import ProjectTaskGroupsPage from '@app/domain/project/pages/project-task-groups-page/project-task-groups-page';
import ProjectFeaturesPage from '@app/domain/project/pages/project-features-page/project-features-page';
import ProjectReleaseNotesPage from '@app/domain/project/pages/project-release-notes-page/project-release-notes-page';
import ReleaseNotesShow from '@app/domain/release-note/routes/release-notes-show';
import ProjectNewsPage from '@app/domain/project/pages/project-news-page/project-news-page';
import NewsShow from '@app/domain/news/routes/news-show';
import HeaderSettingsPage from '@app/domain/header/pages/header-settings-page';
import useHeaderShowQuery from '@app/data/header/use-header-show-query';
import useProjectShowQuery from '@app/data/project/use-project-show-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const ProjectShow = () => {
    const projectHeaderRef = useRef(null);
    const location = useLocation();

    const [isHeaderIncluded, setIsHeaderIncluded] = useState(false);
    const [projectHeaderHeight, setProjectHeaderHeight] = useState(0);
    const [isProjectHeaderCssLoaded, setIsProjectHeaderCssLoaded] =
        useState(false);

    const {
        authUser,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAdminOrTeamMemberToAnyProjects,
    } = usePermissionsContextApi();

    const { isLoading: isProjectDataLoading, data: projectData } =
        useProjectShowQuery(projectSlug);

    const { data: header, isLoading: isHeaderDataLoading } =
        useHeaderShowQuery(projectSlug);

    useEffect(() => {
        setIsHeaderIncluded(
            header?.is_included &&
                ![
                    'submission',
                    'team-member',
                    'banned-member',
                    'header-settings',
                    'community-member',
                ].some((segment) =>
                    location.pathname.includes(`/${projectSlug}/${segment}`)
                )
        );

        return () => setIsHeaderIncluded(false);
    }, [header, location]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--header-height',
            isHeaderIncluded ? projectHeaderHeight + 'px' : 0 + 'px'
        );

        return () =>
            document.documentElement.style.setProperty(
                '--header-height',
                0 + 'px'
            );
    }, [location, projectHeaderHeight, isHeaderIncluded]);

    if (isProjectDataLoading || isHeaderDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            {isHeaderIncluded && (
                <link
                    rel="stylesheet"
                    href={`/api/header/${header.id}/styles`}
                    onLoad={() => setIsProjectHeaderCssLoaded(true)}
                />
            )}
            {isProjectHeaderCssLoaded && (
                <ProjectHeader
                    ref={projectHeaderRef}
                    header={header}
                    setHeight={setProjectHeaderHeight}
                />
            )}
            <BaseLayout
                hideFooter={projectData.is_page_white_labeled}
                hideSidebar={
                    !authUser?.has_plan &&
                    !isAuthUserAdminOrTeamMemberToAnyProjects
                }
            >
                <Routes>
                    {[
                        '',
                        '/public-news/:publicNewsId',
                        '/task/:taskId',
                        '/task/:taskId/comment/:commentId',
                    ].map((path) => (
                        <Route
                            key="tasks"
                            path={path}
                            element={
                                <ProjectTaskGroupsPage project={projectData} />
                            }
                        />
                    ))}
                    {[
                        '/features',
                        '/features/public-news/:publicNewsId',
                        '/feature/:featureId',
                        '/feature/:featureId/comment/:commentId',
                    ].map((path) => (
                        <Route
                            key="features"
                            path={path}
                            element={
                                <ProjectFeaturesPage project={projectData} />
                            }
                        />
                    ))}
                    {[
                        '/release-notes',
                        '/release-notes/public-news/:publicNewsId',
                    ].map((path) => (
                        <Route
                            key="releaseNotes"
                            path={path}
                            element={
                                <ProjectReleaseNotesPage
                                    project={projectData}
                                />
                            }
                        />
                    ))}
                    <Route
                        path="/release-notes/:releaseNoteId"
                        element={<ReleaseNotesShow />}
                    />
                    <Route
                        path="/news"
                        element={
                            isAuthUserAdmitOrTeamMember(projectData.id) ? (
                                <ProjectNewsPage project={projectData} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/news/:newsId"
                        element={<NewsShow project={projectData} />}
                    />
                    <Route
                        path="/header-settings"
                        element={<HeaderSettingsPage />}
                    />
                </Routes>
            </BaseLayout>
        </>
    );
};

export default ProjectShow;
