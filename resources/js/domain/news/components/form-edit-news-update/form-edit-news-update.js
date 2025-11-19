/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import useNewsUpdateMutation from '@app/data/news/use-news-update-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.mixed().required('This field is required.'),
});

const FormEditNewsUpdate = ({
    closeModal,
    setIsFormChanged,
    setIsEditNewsUpdateModalOpen,
    newsUpdate,
    currentTablePage,
}) => {
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: update } = useNewsUpdateMutation(
        newsUpdate.id,
        projectSlug,
        currentTablePage,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: newsUpdate.title,
            description: newsUpdate.description,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        update(values, {
            onSuccess: () => setIsEditNewsUpdateModalOpen(false),
        });

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
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)} modifier="news" noValidate>
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <div className="form__col-head">
                            <h3>Edit News Update</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="news-close-btn"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            larger
                        />
                    </Form.ColLeft>
                </Form.Content>
                <Form.Footer justify>
                    <div className="form__footer-group">
                        <Button
                            type="button"
                            color="is-transparent"
                            modifier="rectangular"
                            onClick={handleClickCancelButton}
                        >
                            Cancel
                        </Button>
                        {newsUpdate.status !== 'draft' && (
                            <Button
                                type="submit"
                                color="is-transparent"
                                modifier="rectangular"
                                onClick={() => methods.setValue('is_draft', true)}
                            >
                                Save As Draft
                            </Button>
                        )}
                        <Button
                            type="submit"
                            modifier="rectangular"
                            color="is-red"
                            onClick={() => methods.setValue('is_draft', false)}
                        >
                            {newsUpdate.status === 'live'
                                ? 'Update News'
                                : 'Publish News Update'}
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormEditNewsUpdate;
