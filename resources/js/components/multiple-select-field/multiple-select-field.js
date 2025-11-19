/**
 * External dependencies
 */
import React from 'react';
import Select from 'react-select';
import { useFormContext, Controller } from 'react-hook-form';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const MultipleSelectField = ({
    children,
    id,
    title,
    name,
    placeholder,
    data,
    medium,
    higherPadding,
    removeValueHandler,
    maxMenuHeight = 350,
    menuPlacement = 'top',
    readOnly = false,
    marginType,
}) => {
    const { selectedValue: projectSlug } = useHeaderSelectContext();
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    const handleRemoveValue = (values, valueToRemove) =>
        setValue(
            name,
            values.filter((item) => item.value !== valueToRemove.value),
            { shouldDirty: true }
        );

    const handleChange = (values) =>
        setValue(name, values, { shouldDirty: true });

    const customOption = ({ value, label, avatar }) => (
        <div className="multiple-select-field__dropdown">
            {avatar && <img src={avatar} />}
            <div>{label}</div>
        </div>
    );

    const optionsArray =
        data &&
        data.map((item) => ({
            value: item.id,
            label: item?.title || item?.username,
            avatar: item.avatar,
            entireItem: item,
        }));

    return (
        <div
            className={classNames('form__default', {
                medium: medium,
            })}
        >
            <div
                className={classNames('form__field', {
                    [marginType]: marginType,
                })}
            >
                {title && <label htmlFor={id}>{title}</label>}
                {children && <label htmlFor={id}>{children}</label>}

                <Controller
                    name={name}
                    isClearable
                    control={control}
                    render={({ field }) => (
                        <>
                            {!readOnly && (
                                <Select
                                    classNamePrefix="multiple-select-field"
                                    {...field}
                                    onChange={handleChange}
                                    controlShouldRenderValue={false}
                                    isMulti
                                    options={optionsArray}
                                    placeholder={placeholder}
                                    formatOptionLabel={customOption}
                                    menuPosition="absolute"
                                    maxMenuHeight={maxMenuHeight}
                                    menuPlacement={menuPlacement}
                                />
                            )}

                            {errorMessage && (
                                <div className="multiple-select-field-error-message">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="multiple-select-field__value-container">
                                {field.value.map((val, index) => (
                                    <div
                                        className={classNames(
                                            'multiple-select-field__value',
                                            {
                                                'multiple-select-field__value--higher-padding':
                                                    higherPadding,
                                            }
                                        )}
                                        key={`${val.value}-${index}`}
                                    >
                                        {val.entireItem ? (
                                            <TooltipUserAvatar
                                                user={val.entireItem}
                                                projectSlug={projectSlug}
                                            />
                                        ) : (
                                            <span>{val.label}</span>
                                        )}
                                        {!readOnly && (
                                            <button
                                                type="button"
                                                className="multiple-select-field__value-close-button"
                                                name={val.value}
                                                onClick={
                                                    removeValueHandler
                                                        ? removeValueHandler
                                                        : () =>
                                                              handleRemoveValue(
                                                                  field.value,
                                                                  val
                                                              )
                                                }
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default MultipleSelectField;
