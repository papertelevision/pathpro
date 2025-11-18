/**
 * External dependencies
 */
import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import qs from 'qs';
import { useLocation } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';

/**
 * Internal dependencies
 */
import AddCommentSection from '@app/domain/comment/components/add-comment-section';
import Button from '@app/components/button/button';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import CommentsFilter from '@app/domain/comment/components/comments-filter/comments-filter';
import Form from '@app/components/form/form';
import FormEditTaskSuggestions from '@app/domain/task/components/form-edit-task/form-edit-task-suggestions';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import { formEditSubtaskValues } from '@app/domain/task/components/form-edit-subtask/form-edit-subtask-values';
import FormCloseBtn from '@app/components/form/form-close-btn';

const FormEditSubtaskPublicView = ({
    subtask,
    project,
    taskGroup,
    closeModal,
    taskCommentsData,
    sortCommentsBy,
    setSortCommentsBy,
}) => {
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const methods = useForm({
        defaultValues: formEditSubtaskValues(subtask),
    });

    return (
        <FormProvider {...methods}>
            <Form modifier="task">
                <Form.Content>
                    <Form.ColLeft>
                        <div className="form__col-head">
                            <h3>{subtask.title}</h3>
                        </div>
                        {subtask.are_stats_public && (
                            <div className="form__col-left__one-third">
                                <ul>
                                    <li>
                                        Type:{' '}
                                        <strong className="is-blue">
                                            {subtask.task_type.title}
                                        </strong>
                                    </li>
                                    <li>
                                        Group: <span>{taskGroup.title}</span>
                                    </li>
                                    <li>
                                        Status:{' '}
                                        <strong className="is-green">
                                            {subtask.task_status.title}
                                        </strong>
                                    </li>
                                    <li>
                                        Upvotes:{' '}
                                        <span>{subtask.upvotes_count}</span>
                                    </li>
                                    <li>
                                        Highlighted Suggestions:{' '}
                                        <span>
                                            {subtask.highlighted_comments_count}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                        <div className="form__col-public">
                            <div className="form__col-public__description">
                                {parse(
                                    DOMPurify.sanitize(subtask.description, {
                                        ADD_ATTR: ['target'],
                                    })
                                )}
                            </div>
                            {subtask.community_members.length > 0 && (
                                <MultipleSelectField
                                    name="community_members"
                                    title="Suggested by:"
                                    readOnly
                                    data={project.community_members}
                                />
                            )}
                            {subtask.are_team_members_visible &&
                                subtask.team_members.length > 0 && (
                                    <MultipleSelectField
                                        name="team_members"
                                        title="Team Member(s) assigned:"
                                        readOnly
                                        data={project.team_members}
                                    />
                                )}
                        </div>
                    </Form.ColLeft>
                    <Form.ColRight>
                        <div className="form__col-head">
                            <h3>Discussion</h3>
                            <FormCloseBtn onClick={closeModal} />
                        </div>
                        <div className="form-boxes">
                            <div className="form-boxes__item form-boxes__item--auto">
                                {subtask.are_comments_enabled && (
                                    <>
                                        <AddCommentSection
                                            task={subtask}
                                            project={project}
                                            modelType="task"
                                            sortCommentsBy={sortCommentsBy}
                                        />
                                        <div className="form__feedback">
                                            <span>
                                                Feedback & Suggestions (
                                                {taskCommentsData.length})
                                            </span>
                                            <CommentsFilter
                                                setSortCommentsBy={
                                                    setSortCommentsBy
                                                }
                                                sortCommentsBy={sortCommentsBy}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            {subtask.are_comments_enabled && (
                                <div className="form-boxes__item form-boxes__item--scroll">
                                    <FormEditTaskSuggestions
                                        project={project}
                                        suggestions={taskCommentsData}
                                        task={subtask}
                                        sortCommentsBy={sortCommentsBy}
                                    />
                                </div>
                            )}
                        </div>
                    </Form.ColRight>
                </Form.Content>
                <Form.Footer>
                    <div className="form__footer-group">
                        <Button
                            type="button"
                            color="is-transparent"
                            modifier="rectangular"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                        {subtask.is_task_upvoting_enabled && (
                            <BoxButtonUpvote
                                project={project}
                                showUpvotesCount={false}
                                showIcon={true}
                                upvotable={subtask}
                                upvotableType="task"
                                invalidateQueries={[
                                    [`task/show`, subtask.id],
                                    [
                                        'projects/task-groups/index',
                                        project.slug,
                                        queryArgs,
                                    ],
                                    [
                                        'project/release-notes/index',
                                        project.slug,
                                    ],
                                ]}
                            />
                        )}
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormEditSubtaskPublicView;
