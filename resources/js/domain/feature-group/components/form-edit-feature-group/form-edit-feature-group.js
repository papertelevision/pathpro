/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import FormColorPicker from '@app/components/form/form-color-picker';
import FormIconPicker from '@app/components/form/form-icon-picker';
import useFeatureGroupUpdateMutation from '@app/data/feature-group/use-feature-group-update-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
});

const FormEditFeatureGroup = ({
    featureGroup,
    closeModal,
    setIsFormChanged,
    setIsEditFeatureGroupModalOpen,
}) => {
    const [icon, setIcon] = useState(null);
    const [predefinedIconId, setPredefinedIconId] = useState(featureGroup.icon_type === 'predefined' ? featureGroup.icon_identifier : null);
    const [displayColor, setDisplayColor] = useState(featureGroup.header_color);

    const { mutate: update } = useFeatureGroupUpdateMutation(
        featureGroup.id,
        projectSlug
    );

    const methods = useForm({
        defaultValues: {
            icon: icon,
            title: featureGroup.title,
            header_color: featureGroup.header_color,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        update(
            {
                ...values,
                header_color: displayColor,
                icon: icon,
                icon_type: predefinedIconId ? 'predefined' : (icon ? 'uploaded' : featureGroup.icon_type),
                icon_identifier: predefinedIconId || null,
            },
            {
                onSuccess: () => setIsEditFeatureGroupModalOpen(false),
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
                encType="multipart/form-data"
                onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
                <Form.Content fixedHeight>
                    <Form.ColLeft maxWidth>
                        <FormField title="Title" id="title" name="title" />

                        <FormColorPicker
                            name="header_color"
                            displayColor={displayColor}
                            setDisplayColor={setDisplayColor}
                        />

                        <FormIconPicker
                            name="feature-group-icon"
                            setIcon={setIcon}
                            iconUrl={featureGroup.icon_url}
                            iconData={featureGroup.icon_data}
                            predefinedIconId={predefinedIconId}
                            onPredefinedIconChange={setPredefinedIconId}
                        />
                    </Form.ColLeft>
                </Form.Content>

                <Form.Footer>
                    <Button
                        type="button"
                        color="red-text"
                        onClick={handleClickCancelButton}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" rounded larger color="blue">
                        Update Feature Group!
                    </Button>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormEditFeatureGroup;
