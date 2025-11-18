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
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import Loader from '@app/components/loader/loader';
import TableNewsShow from '@app/domain/news/components/table-news-show/table-news-show';
import useNewsShowQuery from '@app/data/news/use-news-show-query';
import Header from '@app/components/header/header';

const NewsShow = ({ project }) => {
    const { newsId } = useParams();
    const { isLoading: isNewsDataLoading, data: newsData } =
        useNewsShowQuery(newsId);

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            description: '',
        },
    });

    if (isNewsDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <Fragment>
            <Header showHeaderSelect />
            <Subheader>
                <Subheader.Left>
                    <NavLink to="/news" className="btn-back">
                        Go Back
                    </NavLink>
                    <span className="subheader__divider"></span>
                    <strong>News Details</strong>
                </Subheader.Left>
            </Subheader>

            <Page color="gray">
                <div className="flex-row">
                    <div className="flex-col flex-col--two-third">
                        <FormProvider {...methods}>
                            <Form noValidate modifier="table">
                                <TableNewsShow
                                    news={newsData}
                                    project={project}
                                />
                                <FormField
                                    title="Title"
                                    id="title"
                                    name="title"
                                    defaultValue={newsData.title}
                                    readOnly
                                />
                                <RichTextEditor
                                    label="Description"
                                    name="description"
                                    modifier="table"
                                    readOnly
                                    value={newsData.description}
                                />
                            </Form>
                        </FormProvider>
                    </div>
                </div>
            </Page>
        </Fragment>
    );
};

export default NewsShow;
