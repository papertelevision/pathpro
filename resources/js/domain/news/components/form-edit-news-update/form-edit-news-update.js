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
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)} noValidate>
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            larger
                        />
                    </Form.ColLeft>
                </Form.Content>
                <Form.Footer unbordered className="mobile-block">
                    <div className="form-footer__col">
                        <Button
                            type="button"
                            color="close"
                            onClick={handleClickCancelButton}
                        >
                            Cancel
                        </Button>
                        {newsUpdate.status !== 'draft' ? (
                            <>
                                <i className="form-footer__divider"></i>
                                <Button
                                    type="submit"
                                    color="blue-text"
                                    onClick={() =>
                                        methods.setValue('is_draft', true)
                                    }
                                >
                                    Save As Draft
                                </Button>
                            </>
                        ) : (
                            <i className="form-footer__divider form-footer__divider--margin" />
                        )}
                    </div>
                    <div className="form-footer__col">
                        <Button
                            type="submit"
                            rounded
                            medium
                            color="blue"
                            onClick={() => methods.setValue('is_draft', false)}
                        >
                            {newsUpdate.status === 'live'
                                ? 'Edit News Update'
                                : 'Publish News Update'}
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormEditNewsUpdate;
