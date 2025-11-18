/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormSelect from '@app/components/form/form-select';
import FormRectangle from '@app/components/form/form-rectangle';
import Button from '@app/components/button/button';
import ButtonIcon from '@app/components/button/button-icon';
import ButtonDeny from '@app/components/button/button-deny';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import Icon from '@app/components/icon/icon';
import CommentsFilter from '@app/domain/comment/components/comments-filter/comments-filter';
import AddCommentSection from '@app/domain/comment/components/add-comment-section';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import AlertBox from '@app/components/alert-box/alert-box';
import FormRowBox from '@app/components/form/form-row-box';
import FormRow from '@app/components/form/form-row';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import useFeatureUpdateMutation from '@app/data/feature/use-feature-update-mutation';
import useFeatureDestroyMutation from '@app/data/feature/use-feature-destroy-mutation';
import useFeaturesCommentsShowQuery from '@app/data/feature/use-feature-comments-show-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import FormEditTaskSuggestions from '@app/domain/task/components/form-edit-task/form-edit-task-suggestions';
import FormCloseBtn from '@app/components/form/form-close-btn';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.string().required('This field is required.'),
});

const FormEditFeature = ({
    feature,
    types,
    project,
    setSortCommentsBy,
    sortCommentsBy,
    closeModal,
    setIsFormChanged,
    setIsEditFeatureModalOpen,
    setIsConfirmFeatureModalOpen,
    setSelectedFeatureId,
    overallRank,
    modalRedirectUrl,
}) => {
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const { canCreateEditTasksFeatures, isUserLoggedIn } =
        usePermissionsContextApi();

    const navigate = useNavigate();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { featureVisibilities: visibilities } = useQueryContextApi();
    const mutateParams = [feature.id, project.slug, queryArgs];
    const { mutate: mutateFeatureUpdate } = useFeatureUpdateMutation(
        ...mutateParams
    );
    const { mutate: mutateFeatureDestroy } = useFeatureDestroyMutation(
        ...mutateParams
    );

    const { data: comments } = useFeaturesCommentsShowQuery(
        sortCommentsBy,
        feature.id
    );

    const featurePopularity =
        overallRank < 3 ? new Array(3 - overallRank).fill(0) : [];

    const methods = useForm({
        defaultValues: {
            title: feature.title,
            description: feature.description,
            feature_type_id: feature.feature_type_id,
            visibility: feature.visibility,
            are_stats_public: feature.are_stats_public,
            community_members: feature.community_members.map((member) => ({
                value: member.id,
                avatar: member.avatar,
                label: member.username,
                entireItem: member,
            })),
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateFeatureUpdate(
            {
                ...values,
                community_members: values.community_members.map(
                    (item) => item.value
                ),
            },
            {
                onSuccess: () => {
                    setSelectedFeatureId(null);
                    setIsEditFeatureModalOpen(false);
                    navigate(modalRedirectUrl);
                },
            }
        );

    const handleOpenConfirmFeatureModal = () => {
        setSelectedFeatureId(feature.id);
        setIsEditFeatureModalOpen(false);
        setIsConfirmFeatureModalOpen(true);
    };

    const handleClickCloseButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    const handleMutateDestroyFeature = () => {
        mutateFeatureDestroy(feature.id, {
            onSuccess: () => {
                setSelectedFeatureId(null);
                setOpenAlertBoxForDeleteAction(false);
                setIsEditFeatureModalOpen(false);
                navigate(modalRedirectUrl);
            },
        });
    };

    useEffect(() => {
        setIsFormChanged(methods.formState.isDirty);
        return () => setIsFormChanged(false);
    }, [methods.formState.isDirty]);

    useEffect(() => {
        return () => setIsEditFeatureModalOpen(false);
    }, []);

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                    modifier="task"
                >
                    <Form.Content>
                        <Form.ColLeft>
                            <div className="form__col-head">
                                <h3>{feature.title}</h3>
                            </div>
                            {isUserLoggedIn &&
                                canCreateEditTasksFeatures(project.id) && (
                                    <FormRowBox smaller className="borderless">
                                        <ButtonDeny
                                            block
                                            type="button"
                                            color="green"
                                            onClick={
                                                handleOpenConfirmFeatureModal
                                            }
                                        >
                                            CONFIRM THIS ITEM
                                        </ButtonDeny>
                                    </FormRowBox>
                                )}
                            {isUserLoggedIn &&
                            canCreateEditTasksFeatures(project.id) ? (
                                <>
                                    <FormRow
                                        marginBottom={
                                            !methods.watch('are_stats_public')
                                        }
                                    >
                                        {methods.watch('are_stats_public') && (
                                            <div className="form__row-text">
                                                <FormRectangle title="Upvotes">
                                                    {feature.upvotes_count}
                                                </FormRectangle>
                                                <FormRectangle title="Feedback & Suggestions">
                                                    <i>Submitted:</i>{' '}
                                                    {feature.comments_count}
                                                    <i>Highlighted:</i>{' '}
                                                    {
                                                        feature.highlighted_comments_count
                                                    }
                                                </FormRectangle>
                                                <FormRectangle title="Overall Rank">
                                                    {featurePopularity.length
                                                        ? featurePopularity.map(
                                                              (_, idx) => (
                                                                  <Icon
                                                                      type="popularity"
                                                                      key={idx}
                                                                  />
                                                              )
                                                          )
                                                        : `${
                                                              overallRank + 1
                                                          } / ${
                                                              project.features_count
                                                          }`}
                                                </FormRectangle>
                                            </div>
                                        )}
                                    </FormRow>
                                    <FormField
                                        title="Title"
                                        id="title"
                                        name="title"
                                    />
                                    <RichTextEditor
                                        label="Description"
                                        name="description"
                                        placeholder="Describe your task, feature, goal or idea here."
                                    />
                                    <FormSelect
                                        title="Type"
                                        id="feature_type_id"
                                        name="feature_type_id"
                                        selected={feature.feature_type.id}
                                        data={types}
                                        type
                                        marginBottom
                                    />
                                    <FormSelect
                                        title="Visibility"
                                        id="visibility"
                                        name="visibility"
                                        selected={feature.visibility}
                                        data={visibilities}
                                        marginBottom
                                    />
                                    <MultipleSelectField
                                        title="This item was suggested by:"
                                        id="community_members"
                                        name="community_members"
                                        placeholder="Start typing to add users..."
                                        data={project.community_members}
                                    />
                                </>
                            ) : (
                                <>
                                    {feature.are_stats_public && (
                                        <div className="form__col-left__one-third">
                                            <ul>
                                                <li>
                                                    Type:{' '}
                                                    <strong className="is-blue">
                                                        {
                                                            feature.feature_type
                                                                .title
                                                        }
                                                    </strong>
                                                </li>
                                                <li>
                                                    Upvotes:{' '}
                                                    <span>
                                                        {feature.upvotes_count}
                                                    </span>
                                                </li>
                                                <li>
                                                    Highlighted Suggestions:{' '}
                                                    <span>
                                                        {
                                                            feature.highlighted_comments_count
                                                        }
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    <div className="form__col-public">
                                        <div className="form__col-public__description">
                                            {parse(
                                                DOMPurify.sanitize(
                                                    feature.description,
                                                    {
                                                        ADD_ATTR: ['target'],
                                                    }
                                                )
                                            )}
                                        </div>
                                        {feature.community_members.length >
                                            0 && (
                                            <MultipleSelectField
                                                name="community_members"
                                                title="Suggested by:"
                                                readOnly
                                                data={project.community_members}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </Form.ColLeft>
                        <Form.ColRight>
                            <div className="form__col-head">
                                <h3>Discussion</h3>
                                <FormCloseBtn onClick={closeModal} />
                            </div>
                            <div className="form-boxes">
                                <div className="form-boxes__item form-boxes__item--auto">
                                    {isUserLoggedIn &&
                                        canCreateEditTasksFeatures(
                                            project.id
                                        ) && (
                                            <>
                                                <span>
                                                    Feature / Task Upvoting
                                                </span>
                                                <FormToggle
                                                    id="are_stats_public"
                                                    name="are_stats_public"
                                                    description="Display Stats"
                                                    marginBottom
                                                />
                                            </>
                                        )}
                                    <AddCommentSection
                                        task={feature}
                                        project={project}
                                        modelType="feature"
                                        sortCommentsBy={sortCommentsBy}
                                    />
                                    <div className="form__feedback">
                                        <span>
                                            Feedback & Suggestions (
                                            {feature.comments_count})
                                        </span>
                                        <CommentsFilter
                                            setSortCommentsBy={
                                                setSortCommentsBy
                                            }
                                            sortCommentsBy={sortCommentsBy}
                                        />
                                    </div>
                                </div>
                                <div className="form-boxes__item form-boxes__item--scroll">
                                    <FormEditTaskSuggestions
                                        project={project}
                                        suggestions={comments}
                                        task={feature}
                                        sortCommentsBy={sortCommentsBy}
                                        commentType="featureComment"
                                    />
                                </div>
                            </div>
                        </Form.ColRight>
                    </Form.Content>
                    {isUserLoggedIn &&
                    canCreateEditTasksFeatures(project.id) ? (
                        <Form.Footer justify>
                            <ButtonIcon
                                iconType="trash"
                                hasBorder
                                onClick={() =>
                                    setOpenAlertBoxForDeleteAction(true)
                                }
                            />
                            <div className="form__footer-group">
                                <BoxButtonUpvote
                                    project={project}
                                    showIcon={true}
                                    upvotable={feature}
                                    upvotableType="feature"
                                    showUpvotesCount={false}
                                    invalidateQueries={[
                                        [`feature/show`, feature.id],
                                        [
                                            'project/features/index',
                                            project.slug,
                                            queryArgs,
                                        ],
                                    ]}
                                />
                                <Button
                                    type="button"
                                    color="is-transparent"
                                    modifier="rectangular"
                                    onClick={handleClickCloseButton}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="submit"
                                    modifier="rectangular"
                                    color="is-red"
                                >
                                    Update
                                </Button>
                            </div>
                        </Form.Footer>
                    ) : (
                        <Form.Footer justify>
                            <div></div>
                            <div className="form__footer-group">
                                <BoxButtonUpvote
                                    project={project}
                                    showUpvotesCount={false}
                                    showIcon={true}
                                    upvotable={feature}
                                    upvotableType="feature"
                                    invalidateQueries={[
                                        [`feature/show`, feature.id],
                                        [
                                            'project/features/index',
                                            project.slug,
                                            queryArgs,
                                        ],
                                    ]}
                                />
                                <Button
                                    type="button"
                                    color="is-transparent"
                                    modifier="rectangular"
                                    onClick={handleClickCloseButton}
                                >
                                    Close
                                </Button>
                            </div>
                        </Form.Footer>
                    )}
                </Form>
            </FormProvider>

            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                setIsModalOpen={setIsEditFeatureModalOpen}
                deleteAction={handleMutateDestroyFeature}
                message="Are you sure you want to delete this feature ?"
            />
        </Fragment>
    );
};

export default FormEditFeature;
