/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormRow from '@app/components/form/form-row';
import useProjectSubmissionStoreMutation from '@app/data/project/use-project-submission-store-mutation';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.string().required('This field is required.'),
});

const FormAddPublicSubmission = ({
    project,
    closeModal = () => {},
    onSuccess = () => {},
    setIsFormChanged = () => {},
}) => {
    const { mutate: mutateSubmissionStore } = useProjectSubmissionStoreMutation(
        project.slug
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            project_id: project.id,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateSubmissionStore(values, {
            onSuccess: () => onSuccess(),
        });

    useEffect(() => {
        setIsFormChanged(methods.formState.isDirty);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                modifier="suggest"
            >
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <FormField
                            id="title"
                            name="title"
                            placeholder="Title your feedback or briefly summarize"
                        />
                        <FormTextArea
                            id="description"
                            name="description"
                            placeholder="Give us the details on your idea, feedback, feature idea, etc. Be sure to be as descriptive as possible!"
                        />
                    </Form.ColLeft>
                </Form.Content>
                <Form.Footer>
                    <Button
                        type="button"
                        color="is-transparent"
                        modifier="rectangular"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" modifier="rectangular" color="is-red">
                        Submit
                    </Button>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormAddPublicSubmission;
