/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Header from '@app/components/header/header';
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import BoxButtonShare from '@app/components/box/box-button-share';
import Page from '@app/components/page/page';
import Icon from '@app/components/icon/icon';
import Modal from '@app/components/modal/modal';
import ModalShowNews from '@app/domain/news/components/modal-show-news/modal-show-news';
import ModalAddSubmission from '@app/domain/submission/components/modal-add-submission/modal-add-submission';
import FormAddFeature from '@app/domain/feature/components/form-add-feature/form-add-feature';
import Feature from '@app/domain/feature/components/feature/feature';
import FeatureGroup from '@app/domain/feature-group/components/feature-group/feature-group';
import FeatureModals from '@app/domain/feature/components/feature/feature-modals';
import Loader from '@app/components/loader/loader';
import useProjectFeatureGroupShowQuery from '@app/data/project/use-project-feature-group-show-query';
import useProjectFeaturesIndexQuery from '@app/data/project/use-project-features-index-query';
import useFeatureTypesIndexQuery from '@app/data/feature-type/use-feature-types-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const ProjectFeaturesPage = ({ project }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });
    const { featureId, publicNewsId } = useParams();

    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isAddFeatureTaskModalOpen, setIsAddFeatureTaskModalOpen] =
        useState(false);
    const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
    const [isConfirmFeatureModalOpen, setIsConfirmFeatureModalOpen] =
        useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [modalRedirectUrl, setModalRedirectUrl] = useState();
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(!!publicNewsId);
    const [isAddSubmissionModalOpen, setIsAddSubmissionModalOpen] =
        useState(false);
    const [filterValue, setFilterValue] = useState(queryArgs?.type);
    const [isInfoSectionVisible, setIsInfoSectionVisible] = useState(false);
    const [featureGroupHeight, setFeatureGroupHeight] = useState();

    const { data: featureGroup, isLoading: isFeatureGroupLoading } =
        useProjectFeatureGroupShowQuery(project.slug);
    const {
        data: featuresData,
        isLoading: isFeaturesLoading,
        fetchNextPage,
    } = useProjectFeaturesIndexQuery(project.slug, queryArgs);
    const { data: featureTypesData, isLoading: isFeatureTypesDataLoading } =
        useFeatureTypesIndexQuery();

    const features = (featuresData?.pages || []).reduce((memo, page) => {
        memo = [...memo, ...page.data.data];

        return memo;
    }, []);

    const handleFeatureOverallRank = (featureId) =>
        featuresData?.pages[0].data.meta.overall_ranks.indexOf(featureId);

    const {
        canCreateEditTasksFeatures,
        isUserLoggedIn,
        isAuthUserAdmitOrTeamMember,
    } = usePermissionsContextApi();

    const closeAddFeatureTaskModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddFeatureTaskModalOpen(false);
        }
    };

    const closeEditFeatureModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditFeatureModalOpen(false);
            setSelectedFeatureId(null);
            navigate(modalRedirectUrl);
        }
    };

    const closeConfirmFeatureModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsConfirmFeatureModalOpen(false);
            setSelectedFeatureId(null);
            navigate(modalRedirectUrl);
        }
    };

    useEffect(() => {
        setFilterValue(
            qs.parse(location?.search, { ignoreQueryPrefix: true })?.type
        );

        if (parseInt(featureId)) {
            setModalRedirectUrl('/features');
            setIsEditFeatureModalOpen(true);
            setSelectedFeatureId(featureId);
        } else {
            setModalRedirectUrl(location);
        }
    }, [featureId, location]);

    if (
        isFeatureGroupLoading ||
        isFeaturesLoading ||
        isFeatureTypesDataLoading
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
                    {project?.tabs.find((tab) => tab.value === 'featureVoting')
                        ?.label || 'Feature Voting'}
                </Subheader.Left>

                <Subheader.Right>
                    <BoxButtonShare
                        place="bottom"
                        page="features"
                        className="share"
                        shareObject="project"
                        shareUrl={project.slug}
                    />
                    {canCreateEditTasksFeatures(project.id) && (
                        <Button
                            type="button"
                            modifier="add-record"
                            icon
                            onClick={() => setIsAddFeatureTaskModalOpen(true)}
                        >
                            Add New
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

            <Page color="gray">
                <FeatureGroup
                    project={project}
                    featureGroup={featureGroup}
                    featureTypes={featureTypesData}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    isInfoSectionVisible={isInfoSectionVisible}
                    setIsInfoSectionVisible={setIsInfoSectionVisible}
                    setFeatureGroupHeight={setFeatureGroupHeight}
                />
                <div
                    id="box__feature-tasks"
                    className="box__feature-tasks"
                    style={{
                        height: 'auto',
                        paddingTop: isInfoSectionVisible ? '0px' : '9px',
                    }}
                >
                    <InfiniteScroll
                        dataLength={featuresData?.pages.length * 11}
                        scrollableTarget="box__feature-tasks"
                        next={fetchNextPage}
                        hasMore={true}
                    >
                        {features.length > 0 ? (
                            features.map((feature, idx) => (
                                <Feature
                                    key={`${feature.id} / ${idx} / ${feature.title}`}
                                    feature={feature}
                                    project={project}
                                    queryArgs={queryArgs}
                                    setIsEditFeatureModalOpen={
                                        setIsEditFeatureModalOpen
                                    }
                                    setIsConfirmFeatureModalOpen={
                                        setIsConfirmFeatureModalOpen
                                    }
                                    setSelectedFeatureId={setSelectedFeatureId}
                                    overallRank={handleFeatureOverallRank(
                                        feature.id
                                    )}
                                />
                            ))
                        ) : (
                            <div style={{
                                padding: '60px 40px 60px 40px',
                                maxWidth: '700px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '30px'
                            }}>
                                <img
                                    src="/images/soundhorn.png"
                                    alt="Loudspeaker"
                                    style={{
                                        maxWidth: '120px',
                                        height: 'auto',
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{
                                    textAlign: 'left'
                                }}>
                                    <h2 style={{
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        marginTop: '0',
                                        marginBottom: '6px',
                                        color: '#333'
                                    }}>
                                        Ready to test those ideas?
                                    </h2>
                                    <p style={{
                                        fontSize: '16px',
                                        lineHeight: '1.6',
                                        color: '#666',
                                        margin: '0'
                                    }}>
                                        Feature voting helps your community share ideas and shape what you build next. It's a great way to see which features people want most and how they'd like them to work. Once a feature gets enough love, you can move it right into your roadmap. To get started, just click "Add New" at the top right!
                                    </p>
                                </div>
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
            </Page>

            {canCreateEditTasksFeatures(project.id) && (
                <Modal
                    className="full-height"
                    modalIsOpen={isAddFeatureTaskModalOpen}
                    setIsModalOpen={setIsAddFeatureTaskModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={closeAddFeatureTaskModal}
                >
                    <Modal.Content>
                        <FormAddFeature
                            project={project}
                            featureTypesData={featureTypesData}
                            closeModal={closeAddFeatureTaskModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsAddFeatureTaskModalOpen={
                                setIsAddFeatureTaskModalOpen
                            }
                        />
                    </Modal.Content>
                </Modal>
            )}

            <FeatureModals
                project={project}
                featureTypesData={featureTypesData}
                selectedFeatureId={selectedFeatureId}
                setSelectedFeatureId={setSelectedFeatureId}
                openAlertBox={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                isEditFeatureModalOpen={isEditFeatureModalOpen}
                setIsEditFeatureModalOpen={setIsEditFeatureModalOpen}
                closeEditFeatureModal={closeEditFeatureModal}
                setIsFormChanged={setIsFormChanged}
                modalRedirectUrl={modalRedirectUrl}
                isConfirmFeatureModalOpen={isConfirmFeatureModalOpen}
                setIsConfirmFeatureModalOpen={setIsConfirmFeatureModalOpen}
                closeConfirmFeatureModal={closeConfirmFeatureModal}
            />

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

export default ProjectFeaturesPage;
