/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router';
import qs from 'qs';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormRectangle from '@app/components/form/form-rectangle';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import FormToggle from '@app/components/form/form-toggle';
import FormRow from '@app/components/form/form-row';
import FormRowBox from '@app/components/form/form-row-box';
import useConfirmedFeatureStoreMutation from '@app/data/feature/use-confirmed-feature-store-mutation';

const FormConfirmFeature = ({
    feature,
    project,
    closeModal,
    setIsFormChanged,
    setIsConfirmFeatureModalOpen,
    setSelectedFeatureId,
    overallRank,
}) => {
    const featurePopularity =
        overallRank < 3 ? new Array(3 - overallRank).fill(0) : [];

    const [isChecked, setIsChecked] = useState(feature.is_task_confirmed);
    const [toggleSwitch, setToggleSwitch] = useState(false);

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: mutateConfirmedFeatureStore } =
        useConfirmedFeatureStoreMutation(project.slug, feature.id, queryArgs);

    const handleToggleSwitch = () => {
        methods.setValue('add_to_roadmap', !toggleSwitch, {
            shouldDirty: true,
        });
        setToggleSwitch(!toggleSwitch);
    };

    const handleCheckBox = () => {
        setIsChecked(!isChecked);
    };

    const methods = useForm({
        defaultValues: {
            add_to_roadmap: false,
        },
        mode: 'all',
    });

    const handleFormSubmit = (values) =>
        mutateConfirmedFeatureStore(values, {
            onSuccess: () => {
                setSelectedFeatureId(null);
                setIsConfirmFeatureModalOpen(false);
            },
        });

    const handleClickGoBackButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <div className="form__col-head" style={{ paddingTop: '8px', paddingBottom: '18px', borderBottom: '1px solid #e1e1e1', marginBottom: '28px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Ready to confirm this item?</h3>
                        </div>
                        <FormRow>
                            <div style={{ marginBottom: '20px' }}>
                                <strong style={{ fontSize: '16px' }}>{feature.title}</strong>
                                <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.6' }}>
                                    {parse(
                                        DOMPurify.sanitize(
                                            feature.description,
                                            { ADD_ATTR: ['target'] }
                                        )
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '14px', paddingRight: '17px' }}>
                                <div style={{ flex: '0 0 20%' }}>
                                    <FormRectangle title="Upvotes">
                                        {feature.upvotes_count}
                                    </FormRectangle>
                                </div>
                                <div style={{ flex: '0 0 50%' }}>
                                    <FormRectangle title="Feedback & Suggestions" style={{ paddingLeft: '13px', paddingRight: '13px' }}>
                                        <i>Submitted:</i> {feature.comments_count}
                                        <i>Highlighted:</i>{' '}
                                        {feature.highlighted_comments_count}
                                    </FormRectangle>
                                </div>
                                <div style={{ flex: '0 0 30%' }}>
                                    <FormRectangle title="Overall Rank">
                                        {featurePopularity.length
                                            ? featurePopularity.map((_, idx) => (
                                                  <Icon
                                                      type="popularity"
                                                      key={idx}
                                                  />
                                              ))
                                            : `${overallRank + 1} / ${
                                                  project.features_count
                                              }`}
                                    </FormRectangle>
                                </div>
                            </div>
                        </FormRow>
                        <FormRowBox colored>
                            <FormCheckbox
                                id="is_task_confirmed"
                                name="is_task_confirmed"
                                description="Yes, I am ready to confirm this item."
                                onClick={handleCheckBox}
                                defaultChecked={feature.is_task_confirmed}
                            />
                        </FormRowBox>
                        <FormRowBox
                            opacityUnset={
                                isChecked && project.task_groups.length
                            }
                        >
                            <FormToggle
                                id="add_to_roadmap"
                                name="add_to_roadmap"
                                title="Confirm Only"
                                description="Confirm and Add to Roadmap"
                                onClick={handleToggleSwitch}
                                modifier="dual-label"
                            />
                        </FormRowBox>
                        <FormRow opacity={!toggleSwitch || !isChecked} style={{ paddingTop: '15px' }}>
                            <FormSelect
                                title="Assign to Task Group"
                                id="task_group_id"
                                name="task_group_id"
                                selected={
                                    project.task_groups.length &&
                                    project.task_groups[0].id
                                }
                                data={
                                    project.task_groups.length
                                        ? project.task_groups
                                        : [
                                              {
                                                  id: 0,
                                                  name: 'Please, create task group first.',
                                              },
                                          ]
                                }
                                topMenu
                                marginBottom
                                invisible={!toggleSwitch || !isChecked}
                            />
                            <div className="form__row">
                                <p style={{ fontStyle: 'italic' }}>
                                    Note: You can edit all task details once moved to the project roadmap.
                                </p>
                            </div>
                        </FormRow>
                    </Form.ColLeft>
                </Form.Content>
                <Form.Footer justify>
                    <Button
                        type="button"
                        color="blue-text"
                        onClick={handleClickGoBackButton}
                    >
                        Cancel
                    </Button>
                    <div className="form__footer-group">
                        <Button
                            disabled={!methods.getValues('is_task_confirmed')}
                            type="submit"
                            modifier="rectangular"
                            color="is-red"
                        >
                            Confirm Item
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormConfirmFeature;
