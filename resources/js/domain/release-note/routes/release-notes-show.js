/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import Subheader from '@app/components/subheader/subheader';
import FormField from '@app/components/form/form-field';
import Page from '@app/components/page/page';
import TableReleaseNotesShow from '@app/domain/release-note/components/table-release-notes-show/table-release-notes-show';
import MultiReactSelect from '@app/components/multi-react-select/multi-react-select';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import Loader from '@app/components/loader/loader';
import useReleaseNoteShowQuery from '@app/data/release-note/use-release-note-show-query';
import Header from '@app/components/header/header';

const ReleaseNotesShow = () => {
    const { releaseNoteId } = useParams();

    const { isLoading: isReleaseNoteDataLoading, data: releaseNoteData } =
        useReleaseNoteShowQuery(releaseNoteId);

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            description: '',
        },
    });

    if (isReleaseNoteDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <Fragment>
            <Header showHeaderSelect />
            <Subheader>
                <Subheader.Left>
                    <NavLink to="/release-notes" className="btn-back">
                        Go Back
                    </NavLink>
                    <span className="subheader__divider"></span>
                    <strong>Release Note Details</strong>
                </Subheader.Left>
            </Subheader>

            <Page color="gray">
                <div className="flex-row">
                    <div className="flex-col flex-col--two-third">
                        <FormProvider {...methods}>
                            <Form noValidate modifier="table">
                                <TableReleaseNotesShow
                                    releaseNote={releaseNoteData}
                                />
                                <FormField
                                    title="Title"
                                    id="title"
                                    name="title"
                                    defaultValue={releaseNoteData.title}
                                    readOnly
                                />
                                <MultiReactSelect
                                    title="Included Completed Tasks"
                                    id="tasks"
                                    name="tasks"
                                    placeholder="No complete tasks included."
                                    isDisabled
                                    selectedValues={
                                        releaseNoteData.completed_tasks
                                    }
                                />
                                <RichTextEditor
                                    label="Description"
                                    name="description"
                                    modifier="table"
                                    readOnly
                                    value={releaseNoteData.description}
                                />
                            </Form>
                        </FormProvider>
                    </div>
                </div>
            </Page>
        </Fragment>
    );
};

export default ReleaseNotesShow;
