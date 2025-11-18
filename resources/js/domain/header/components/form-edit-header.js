/**
 * External dependencies
 */
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import Form from '@app/components/form/form';
import Button from '@app/components/button/button';
import FormRow from '@app/components/form/form-row';
import Repeater from '@app/components/repeater/repeater';
import FormField from '@app/components/form/form-field';
import FormContent from '@app/components/form/form-content';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormIconPicker from '@app/components/form/form-icon-picker';
import FormColorPicker from '@app/components/form/form-color-picker';
import useHeaderUpdateMutation from '@app/data/header/use-header-update-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const menuLinksSchema = yup.object().shape({
    url: yup.lazy((value) =>
        value === '#' ? yup.string() : yup.string().url().nullable()
    ),
    label: yup.string().required(),
    css_class: yup.string().nullable(),
    open_url_in_new_tab: yup.boolean(),
});

const schema = yup.object().shape({
    is_included: yup.boolean(),
    height: yup.lazy((value) =>
        value === '' ? yup.string() : yup.number().positive().integer()
    ),
    width: yup.lazy((value) =>
        value === '' ? yup.string() : yup.number().positive().integer()
    ),
    background_color: yup.string(),
    logo_url: yup.lazy((value) =>
        value === '#' ? yup.string() : yup.string().url().nullable()
    ),
    open_logo_url_in_new_tab: yup.boolean(),
    custom_css: yup.string().nullable(),
    menu_links: yup.array().of(menuLinksSchema).required(),
    custom_domain: yup.string().nullable(),
    is_dns_configured: yup.boolean(),
    accent_color: yup.string(),
});

const FormEditHeader = ({ header, titles }) => {
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const [logo, setLogo] = useState(null);
    const [favicon, setFavicon] = useState(null);
    const { mutate } = useHeaderUpdateMutation(header.id, projectSlug);

    const defaultValues = {
        logo: logo,
        favicon: favicon,
        tabs: header.tabs,
        titles: titles,
        logo_url: header.logo_url,
        width: header.width || '',
        height: header.height || '',
        menu_links: header.menu_links || [],
        custom_css: header.custom_css || '',
        is_included: header.is_included,
        background_color: header.background_color,
        open_logo_url_in_new_tab: header.open_logo_url_in_new_tab,
        custom_domain: header.custom_domain,
        submit_feedback_button_text: header.submit_feedback_button_text,
        is_dns_configured: header.is_dns_configured,
        accent_color: header.accent_color || '#3376a3',
    };

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    const { control } = methods;
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'menu_links',
    });

    const handleFormSubmit = (values) => {
        mutate(
            {
                ...values,
                logo,
                favicon,
            },
            {
                onSuccess: () => {
                    setPopupNotificationText('Settings Updated!');
                    setIsPopupNotificationVisible(true);
                },
            }
        );
    };

    useEffect(() => {
        methods.reset(defaultValues);
    }, [header]);

    return (
        <FormProvider {...methods}>
            <Form
                modifier="header-settings"
                encType="multipart/form-data"
                onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
                <div className="flex-row justify-start spacing-20">
                    <div className="flex-col">
                        <div className="flex-heading">
                            <h3>General Settings</h3>
                        </div>
                        <FormContent modifier="left">
                            <FormRow>
                                <FormColorPicker
                                    title="Accent Color"
                                    name="accent_color"
                                    modifier="horizontal"
                                    displayColor={methods.watch(
                                        'accent_color'
                                    )}
                                    setDisplayColor={(color) =>
                                        methods.setValue(
                                            'accent_color',
                                            color
                                        )
                                    }
                                />
                            </FormRow>
                        </FormContent>

                        <div className="flex-heading">
                            <h3>Header Settings</h3>
                            <Icon
                                type="question"
                                data-tooltip-id="tooltip-header-settings"
                            />
                        </div>
                        <FormContent modifier="left">
                            <FormRow>
                                <FormCheckbox
                                    id="is_included"
                                    name="is_included"
                                    description="Include Custom Header"
                                />
                            </FormRow>
                            <FormRow>
                                <FormField
                                    id="height"
                                    name="height"
                                    type="number"
                                    title="Height (in px)"
                                />
                                <FormField
                                    id="width"
                                    name="width"
                                    type="number"
                                    title="Width (in px)"
                                />
                                <FormColorPicker
                                    title="Background Color"
                                    name="background_color"
                                    modifier="horizontal"
                                    displayColor={methods.watch(
                                        'background_color'
                                    )}
                                    setDisplayColor={(bgColor) =>
                                        methods.setValue(
                                            'background_color',
                                            bgColor
                                        )
                                    }
                                />
                            </FormRow>
                            <FormRow>
                                <FormIconPicker
                                    title="Upload Logo"
                                    buttonText="Select File"
                                    name="logo"
                                    modifier="horizontal"
                                    setIcon={setLogo}
                                    iconUrl={header?.logo}
                                    iconData={header?.logo_data}
                                />
                                <FormField
                                    id="logo_url"
                                    name="logo_url"
                                    title="Logo URL"
                                />
                                <FormCheckbox
                                    id="open_logo_url_in_new_tab"
                                    name="open_logo_url_in_new_tab"
                                    description="Open in new tab"
                                />
                            </FormRow>
                            <FormRow>
                                <Repeater
                                    fields={fields}
                                    addField={append}
                                    moveField={move}
                                    removeField={remove}
                                />
                            </FormRow>
                            <FormRow>
                                <FormTextArea
                                    title="Custom CSS"
                                    id="custom_css"
                                    name="custom_css"
                                    rows="9"
                                    setTextAreaValue={(content) =>
                                        methods.setValue('custom_css', content)
                                    }
                                    textAreaValue={methods.watch('custom_css')}
                                />
                            </FormRow>
                        </FormContent>

                        <Form.Footer style={{ marginBottom: '30px' }}>
                            <Button
                                type="submit"
                                modifier="rectangular"
                                color="is-blue"
                            >
                                Save/Update
                            </Button>
                        </Form.Footer>
                    </div>
                    <div className="flex-col">
                        <div className="flex-heading">
                            <h3>Other Project Settings</h3>
                        </div>
                        <FormContent modifier="right">
                            <div className="form__header">
                                <h3>Titles</h3>
                            </div>
                            {header.tabs.map((tab, index) => (
                                <FormRow key={index}>
                                    <FormField
                                        id={`tabs[${index}].label`}
                                        name={`tabs[${index}].label`}
                                        defaultValue={tab.label}
                                        textColor={
                                            tab.is_default &&
                                            !methods.formState.dirtyFields[
                                                'tabs'
                                            ]?.at(index)?.label
                                                ? 'gray-text'
                                                : ''
                                        }
                                    />
                                </FormRow>
                            ))}

                            <div className="form__header">
                                <h3>Submit Feedback Button</h3>
                            </div>
                            <FormRow>
                                <FormField
                                    id="submit_feedback_button_text"
                                    name="submit_feedback_button_text"
                                    textColor={
                                        methods.watch(
                                            'submit_feedback_button_text'
                                        ) === 'Submit Feedback' && 'gray-text'
                                    }
                                />
                            </FormRow>
                        </FormContent>

                        <FormContent modifier="right">
                            <div className="form__header">
                                <h3>Custom Domain</h3>
                            </div>
                            <FormRow>
                                <FormField
                                    id="custom_domain"
                                    name="custom_domain"
                                    placeholder="enter your custom domain here"
                                    textColor={
                                        methods.watch('custom_domain')
                                            ? ''
                                            : 'gray-text'
                                    }
                                />
                                <div className="form__row-box">
                                    <p>
                                        <b>Note:</b> Setting a custom domain can
                                        take 24-48 hours. You must also follow{' '}
                                        <NavLink
                                            to={
                                                process.env
                                                    .MIX_CUSTOM_DOMAIN_INSTRUCTIONS_URL
                                            }
                                            target="_blank"
                                        >
                                            these instructions
                                        </NavLink>{' '}
                                        to configure your host’s DNS settings.
                                    </p>

                                    <FormCheckbox
                                        id="is_dns_configured"
                                        name="is_dns_configured"
                                        description="I confirm that I've properly set my DNS settings"
                                    />
                                </div>
                            </FormRow>

                            <FormRow marginBottom>
                                <FormIconPicker
                                    title="Upload Favicon"
                                    buttonText="Select File"
                                    name="favicon"
                                    modifier="horizontal"
                                    setIcon={setFavicon}
                                    iconUrl={header?.favicon}
                                    iconData={header?.favicon_data}
                                />
                            </FormRow>
                            <Form.Footer>
                                <Button
                                    type="submit"
                                    modifier="rectangular"
                                    color="is-blue"
                                >
                                    Submit Domain
                                </Button>
                            </Form.Footer>
                        </FormContent>
                    </div>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormEditHeader;
