/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import FormSelect from '@app/components/form/form-select';
import FormAddTaskSuggestion from '@app/domain/task/components/form-add-task/form-add-task-suggestion';
import Button from '@app/components/button/button';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import useCommentStoreMutation from '@app/data/comment/use-comment-store-mutation';
import useFeatureStoreMutation from '@app/data/feature/use-feature-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import FormCloseBtn from '@app/components/form/form-close-btn';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.string().required('This field is required.'),
    feature_type_id: yup.string().required('This field is required.'),
});

const FormAddFeature = ({
    project,
    featureTypesData,
    closeModal,
    setIsFormChanged,
    setIsAddFeatureTaskModalOpen,
}) => {
    const { canPinComments } = usePermissionsContextApi();
    const [suggestionsTextareaData, setSuggestionsTextareaData] = useState();
    const [firstSuggestion, setFirstSuggestion] = useState();
    const [suggestionPinnedToTop, setSuggestionPinnedToTop] = useState(false);

    const { featureVisibilities: visibilities } = useQueryContextApi();
    const { mutate: mutateFeatureStore } = useFeatureStoreMutation(
        project.slug
    );
    const { mutate: mutateCommentStore } = useCommentStoreMutation(
        project.slug
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            content: '',
            community_members: [],
            visibility: visibilities[0].id,
            is_comment_pinned_to_top: false,
            are_stats_public: false,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleTextArea = () => {
        setFirstSuggestion(suggestionsTextareaData);
        setSuggestionsTextareaData('');
    };

    const handleAddFirstFeatureTask = (values) => {
        if (firstSuggestion) {
            const firstSuggestionData = {
                content: values.content,
                is_comment_pinned_to_top: values.is_comment_pinned_to_top,
                commentable_id: values.commentable_id,
                commentable_type: values.commentable_type,
            };

            mutateCommentStore(firstSuggestionData, {
                onSuccess: () => setIsAddFeatureTaskModalOpen(false),
            });
        } else {
            setIsAddFeatureTaskModalOpen(false);
        }
    };

    const handleFormSubmit = (values) =>
        mutateFeatureStore(
            {
                ...values,
                community_members: values.community_members.map(
                    (item) => item.value
                ),
            },
            {
                onSuccess: (response) => {
                    values.commentable_id = response.data.data.id;
                    values.commentable_type = 'feature';
                    handleAddFirstFeatureTask(values);
                },
            }
        );

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                modifier="task"
            >
                <Form.Content>
                    <Form.ColLeft>
                        <div className="form__col-head">
                            <h3>Add Feature</h3>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            placeholder="Describe your task, feature, goal or idea here."
                        />
                        <FormSelect
                            title="Type"
                            id="feature_type_id"
                            name="feature_type_id"
                            selected={featureTypesData[0].id}
                            data={featureTypesData}
                            marginBottom
                            type
                        />
                        <FormSelect
                            title="Visibility"
                            id="visibility"
                            name="visibility"
                            selected={visibilities[0].id}
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
                    </Form.ColLeft>

                    <Form.ColRight>
                        <div className="form__col-head">
                            <h3>Discussion</h3>
                            <FormCloseBtn onClick={closeModal} />
                        </div>
                        <div className="form-boxes">
                            <div className="form-boxes__item form-boxes__item--auto">
                                <span>Feature / Task Upvoting</span>
                                <FormToggle
                                    id="are_stats_public"
                                    name="are_stats_public"
                                    description="Display Stats"
                                    marginBottom
                                />
                                <div className="form__suggestion">
                                    <FormTextArea
                                        title="Add Feedback or Suggestion:"
                                        id="content"
                                        name="content"
                                        setTextAreaValue={
                                            setSuggestionsTextareaData
                                        }
                                        textAreaValue={suggestionsTextareaData}
                                    />
                                    <div className="form__suggestion-actions">
                                        <Button
                                            type="button"
                                            modifier="rectangular"
                                            color="is-red"
                                            onClick={handleTextArea}
                                        >
                                            Add Comment
                                        </Button>
                                    </div>
                                    {canPinComments(project.id) && (
                                        <FormCheckbox
                                            id="is_comment_pinned_to_top"
                                            name="is_comment_pinned_to_top"
                                            description="Pin Comment to Top"
                                            onChange={() =>
                                                setSuggestionPinnedToTop(
                                                    !suggestionPinnedToTop
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <div className="form__feedback">
                                    <span>
                                        Feedback & Suggestions (
                                        {firstSuggestion ? 1 : 0})
                                    </span>
                                </div>
                            </div>
                            <div className="form-boxes__item form-boxes__item--scroll">
                                <FormAddTaskSuggestion
                                    project={project}
                                    firstSuggestion={firstSuggestion}
                                    suggestionPinnedToTop={
                                        suggestionPinnedToTop
                                    }
                                    showSuggestions={firstSuggestion}
                                    commentType="featureComment"
                                />
                                {!firstSuggestion && (
                                    <p className="form__feedback-text">
                                        Feedback and suggestions from
                                        subscribers and team members will appear
                                        here after the feature task has been
                                        created. This valuable feedback from
                                        your audience will help shape the
                                        feature/task, and your overall product.
                                    </p>
                                )}
                            </div>
                        </div>
                    </Form.ColRight>
                </Form.Content>
                <Form.Footer>
                    <Button
                        type="button"
                        color="is-transparent"
                        modifier="rectangular"
                        onClick={handleClickCancelButton}
                    >
                        Close
                    </Button>
                    <Button type="submit" modifier="rectangular" color="is-red">
                        Create
                    </Button>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};
export default FormAddFeature;
