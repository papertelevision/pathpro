/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import FormFileUpload from '@app/components/form/form-file-upload';
import FormRow from '@app/components/form/form-row';
import FormRectangle from '@app/components/form/form-rectangle';
import FormRowBox from '@app/components/form/form-row-box';
import Icon from '@app/components/icon/icon';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';

const FormEditTaskLeftCol = ({
    task,
    types,
    statuses,
    projectData,
    methods,
    taskPopularity,
    idxPopularity,
    tasksCount,
    projectTaskGroups,
    isEditMode = false,
    setIsEditMode,
}) => {
    const { taskVisibilities: visibilities } = useQueryContextApi();
    const { canCreateEditTasksFeatures, isUserLoggedIn, isAuthUserAdmitOrTeamMember } =
        usePermissionsContextApi();

    const getFileIcon = (fileName, mimeType = null) => {
        // If mime type is provided, use it
        if (mimeType) {
            if (mimeType.startsWith('image/')) return '🖼️';
            if (mimeType === 'application/pdf') return '📄';
            if (
                mimeType === 'application/msword' ||
                mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
                return '📝';
            if (
                mimeType === 'application/vnd.ms-excel' ||
                mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
                return '📊';
            return '📎';
        }

        // Otherwise use file extension
        const ext = fileName.split('.').pop().toLowerCase();
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

        if (imageExts.includes(ext)) return '🖼️';
        if (ext === 'pdf') return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        return '📎';
    };

    const getTypeColor = (typeTitle) => {
        const colorMap = {
            'New Feature(s)': '#40a758',
            'Revision(s)': '#406ea7',
            'Bug(s)': '#c63c3c',
            'Typo Fix(es)': '#db745c',
            'Code Update (General)': '#b135a7',
            'CSS/Style Update(s)': '#c582d4',
            'Platform Update(s)': '#d62efb',
            'Core Code Update(s)': '#a80bca',
            'Optimization(s)': '#860ca1',
            'Design Tweak(s) (General)': '#30dcce',
            'UX/UI Update(s)': '#30dcce',
            'Branding Update(s)': '#458293',
            'Fonts/Type Update(s)': '#86cce0',
            'General Task': '#599166',
            'Product Idea': '#d69907',
            'General Idea': '#c59728',
            'Feature Review': '#d66807',
            'Needs Feedback': '#884000',
            'Up for Discussion': '#c18047',
            'Team Meeting Topic': '#8c979d',
            'Planning (General)': '#8f987a',
            'Event Planning': '#987a96',
            'Things to Do': '#647867',
            'Where to Eat': '#c5b7b7',
            'Agenda Item': '#999999',
            'Other': '#3e3e3e',
        };
        return colorMap[typeTitle] || '#406ea7'; // Default to blue if not found
    };

    const hasDescriptionContent = (description) => {
        if (!description) return false;
        // Strip HTML tags and check if there's actual text content
        const strippedText = description.replace(/<[^>]*>/g, '').trim();
        return strippedText.length > 0;
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Debug logging
    useEffect(() => {
        console.log('=== Task View Debug ===');
        console.log('isEditMode:', isEditMode);
        console.log('canCreateEditTasksFeatures:', canCreateEditTasksFeatures(projectData.id));
        console.log('isUserLoggedIn:', isUserLoggedIn);
    }, [isEditMode, canCreateEditTasksFeatures, isUserLoggedIn, projectData.id]);

    const handleMarkAsComplete = (isChecked) => {
        methods.setValue('is_task_completed', isChecked, {
            shouldValidate: true,
        });
        const status = statuses.find((status) =>
            isChecked
                ? status.title === 'Complete'
                : status.title === 'Confirmed'
        );
        methods.setValue('task_status_id', status.id, { shouldValidate: true });
    };

    useEffect(() => {
        if (statuses && methods.getValues('task_status_id')?.value) {
            const status = statuses.find(
                (status) =>
                    status.id ===
                    parseInt(methods.getValues('task_status_id').value)
            );
            methods.setValue('is_task_completed', status.title === 'Complete', {
                shouldValidate: true,
            });
        }
    }, [methods.getValues('task_status_id')]);

    return (
        <Form.ColLeft>
            <div className="form__col-head">
                <h3>{task.title}</h3>
            </div>
            {!isUserLoggedIn || !isAuthUserAdmitOrTeamMember(projectData.id, projectData.slug) ? (
                // Community Member View (Public/Read-only)
                <>
                    {task.are_stats_public && (
                        <div className="form__col-left__one-third">
                            <ul>
                                <li>
                                    Type:{' '}
                                    <strong className="is-blue">
                                        {task.task_type.title}
                                    </strong>
                                </li>
                                <li>
                                    Group: <span>{task.task_group.title}</span>
                                </li>
                                <li>
                                    Status:{' '}
                                    <strong className="is-green">
                                        {task.task_status.title}
                                    </strong>
                                </li>
                                <li>
                                    Upvotes: <span>{task.upvotes_count}</span>
                                </li>
                                <li>
                                    Highlighted Suggestions:{' '}
                                    <span>
                                        {task.highlighted_comments_count}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                    <div className="form__col-public">
                        {task.description && task.description.replace(/<[^>]*>/g, '').trim() && (
                            <div className="form__col-public__description form__col-public__description--scrollable">
                                <h4 className="form__col-public__description-header">Description</h4>
                                {parse(
                                    DOMPurify.sanitize(task.description, {
                                        ADD_ATTR: ['target'],
                                    })
                                )}
                            </div>
                        )}
                        {task.attachments && task.attachments.length > 0 && (
                            <div className="form__attachments">
                                <h4>Attachments ({task.attachments.length})</h4>
                                {task.attachments.map((attachment, idx) => (
                                    <div key={idx} className="form__attachment-item">
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                            {attachment.name}
                                        </a>
                                        <span> ({attachment.size})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {task.community_members.length > 0 && (
                            <MultipleSelectField
                                name="community_members"
                                title="Suggested by:"
                                readOnly
                                data={projectData.community_members}
                            />
                        )}
                        {task.are_team_members_visible &&
                            task.team_members.length > 0 && (
                                <MultipleSelectField
                                    name="team_members"
                                    title="Team Member(s) assigned:"
                                    readOnly
                                    data={projectData.team_members}
                                />
                            )}
                    </div>
                </>
            ) : isAuthUserAdmitOrTeamMember(projectData.id, projectData.slug) && !isEditMode ? (
                // Team/Admin Default View (Read-only with full content)
                <>
                    <div className="form__col-left__one-third">
                        <ul>
                            <li>
                                Status:{' '}
                                {task.task_status.title === 'Complete' ? (
                                    <strong className="is-green">
                                        {task.task_status.title}
                                        {task.completed_at && ` ${task.completed_at}`}
                                    </strong>
                                ) : (
                                    <span>
                                        {task.task_status.title}
                                        {task.completed_at && ` ${task.completed_at}`}
                                    </span>
                                )}
                            </li>
                            <li>
                                Type:{' '}
                                <span style={{ color: getTypeColor(task.task_type.title) }}>
                                    {task.task_type.title}
                                </span>
                            </li>
                            <li>
                                Group: <span>{task.task_group.title}</span>
                            </li>
                            <li>
                                Visibility: <span>{capitalizeFirstLetter(task.visibility)}</span>
                            </li>
                            {task.are_stats_public && (
                                <>
                                    <li>
                                        Upvotes: <span>{task.upvotes_count}</span>
                                    </li>
                                    <li>
                                        Highlighted Suggestions:{' '}
                                        <span>
                                            {task.highlighted_comments_count}
                                        </span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="form__col-public">
                        {hasDescriptionContent(task.description) && (
                            <div className="form__col-public__description form__col-public__description--scrollable">
                                <h4 className="form__col-public__description-header">Description</h4>
                                {parse(
                                    DOMPurify.sanitize(task.description, {
                                        ADD_ATTR: ['target'],
                                    })
                                )}
                            </div>
                        )}

                        {task.attachments && task.attachments.length > 0 && (
                            <div className="attachment-list">
                                <div className="attachment-list__header">
                                    <span className="attachment-list__title">
                                        📎 Attachments ({task.attachments.length})
                                    </span>
                                </div>
                                <div className="attachment-list__items">
                                    {task.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="attachment-list__item"
                                        >
                                            <span className="attachment-list__item-icon">
                                                {getFileIcon(attachment.file_name || attachment.name, attachment.mime_type)}
                                            </span>
                                            <div className="attachment-list__item-info">
                                                <a
                                                    href={attachment.url}
                                                    className="attachment-list__item-name"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {attachment.file_name || attachment.name}
                                                </a>
                                                <span className="attachment-list__item-size">
                                                    {attachment.size}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {task.team_members && task.team_members.length > 0 && (
                            <div className="form__team-members-readonly">
                                <h4>Team Member(s)</h4>
                                <div className="form__members-list">
                                    {task.team_members.map((member) => (
                                        <TooltipUserAvatar
                                            key={member.id}
                                            user={member}
                                            isUsernameVisible={true}
                                            projectSlug={projectData.slug}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {task.community_members && task.community_members.length > 0 && (
                            <div className="form__contributors-readonly">
                                <h4>Contributors</h4>
                                <div className="form__members-list">
                                    {task.community_members.map((member) => (
                                        <TooltipUserAvatar
                                            key={member.id}
                                            user={member}
                                            isUsernameVisible={true}
                                            projectSlug={projectData.slug}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // Team/Admin Edit Mode (Editable form)
                <>
                    <FormRowBox smaller>
                        <FormCheckbox
                            id="is_task_completed"
                            name="is_task_completed"
                            description="Mark Task Complete"
                            onClick={(e) =>
                                handleMarkAsComplete(e.target.checked)
                            }
                        />
                    </FormRowBox>
                    <FormRow marginBottom={!methods.watch('are_stats_public')}>
                        {methods.watch('are_stats_public') && (
                            <div className="form__row-text">
                                <FormRectangle title="Upvotes">
                                    {task.upvotes_count}
                                </FormRectangle>
                                <FormRectangle title="Feedback & Suggestions">
                                    <i>Submitted:</i> {task.comments_count}
                                    <i>Highlighted:</i>{' '}
                                    {task.highlighted_comments_count}
                                </FormRectangle>
                                <FormRectangle title="Overall Rank">
                                    {taskPopularity.length
                                        ? taskPopularity.map((_, idx) => (
                                              <Icon
                                                  type="popularity"
                                                  key={idx}
                                              />
                                          ))
                                        : `${
                                              idxPopularity + 1
                                          } / ${tasksCount}`}
                                </FormRectangle>
                            </div>
                        )}
                    </FormRow>
                    <FormField title="Title" id="title" name="title" />
                    <RichTextEditor
                        label="Description"
                        name="description"
                        placeholder="Describe your task, feature, goal or idea here."
                    />
                    <FormFileUpload
                        id="attachments"
                        name="attachments"
                        existingAttachments={task.attachments || []}
                        marginBottom
                    />
                    <FormSelect
                        title="Type"
                        id="task_type_id"
                        name="task_type_id"
                        selected={task.task_type.id}
                        data={types}
                        type
                    />
                    <FormCheckbox
                        id="are_subtasks_allowed"
                        name="are_subtasks_allowed"
                        description="This task includes multiple sub-tasks"
                        defaultChecked={task.subtasks_count}
                        marginBottom
                    />
                    <FormSelect
                        title="Add to Task Group"
                        id="task_group_id"
                        name="task_group_id"
                        selected={task.task_group_id}
                        data={projectTaskGroups}
                        marginBottom
                    />
                    <FormSelect
                        title="Visibility"
                        id="visibility"
                        name="visibility"
                        selected={task.visibility}
                        data={visibilities}
                        marginBottom
                    />
                    <FormSelect
                        title="Status"
                        id="task_status_id"
                        name="task_status_id"
                        selected={methods.watch('task_status_id')}
                        data={statuses}
                        placeholder="Please select status..."
                        marginBottom
                    />
                    <MultipleSelectField
                        title="Assign Team Member(s):"
                        id="team_members"
                        name="team_members"
                        placeholder="Start typing to add team member to overall project..."
                        data={[
                            ...projectData.team_members,
                            projectData.creator,
                        ]}
                    />
                    {methods.watch('team_members')?.length > 0 && (
                        <FormCheckbox
                            id="are_team_members_visible"
                            name="are_team_members_visible"
                            description="Show team member(s) on front-end"
                            marginBottom
                        />
                    )}
                    <FormCheckbox
                        id="is_creator_visible"
                        name="is_creator_visible"
                        description="Show task creator on front-end"
                        marginBottom
                    />
                    <MultipleSelectField
                        title="Give Credit to User(s):"
                        id="community_members"
                        name="community_members"
                        placeholder="Start typing to add users..."
                        data={projectData.community_members}
                    />
                </>
            )}
        </Form.ColLeft>
    );
};

export default FormEditTaskLeftCol;
