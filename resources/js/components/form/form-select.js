/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import classNames from 'classnames';
import Select from 'react-select';

const FormSelect = ({
    id,
    title,
    name,
    selected,
    data,
    marginBottom,
    fewMarginBottom,
    invisible,
    placeholder,
    topMenu,
    onValueUpdate,
    type,
    isDisabled,
    children,
}) => {
    const options = data.map((item) => ({
        label:
            item?.title || item?.username || item?.name || item?.label || item,
        value: item.id || item,
        color: item?.color,
        disabled: item?.disabled || false,
    }));

    const [defaultValue, setDefaultValue] = useState();
    const {
        control,
        formState: { errors },
        setValue,
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    const handleSelectValue = (e) => {
        setDefaultValue(e);
        setValue(name, e.value, { shouldDirty: true });
        onValueUpdate && onValueUpdate(e.value);
    };

    const dot = (color = '#ccc') => ({
        'alignItems': 'center',
        'display': 'flex',
        ':before': {
            backgroundColor: color,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 15,
            width: 15,
        },
    });

    useEffect(() => {
        selected &&
            setDefaultValue(
                options.find(
                    (option) =>
                        option.value === selected ||
                        option === selected ||
                        option.value === selected.value
                )
            );
    }, [selected]);

    useEffect(() => {
        defaultValue &&
            setValue(name, defaultValue.value, { shouldDirty: false });
    }, [defaultValue]);

    return (
        <div className="form__default">
            <div
                className={classNames('form__select', {
                    'margin-bottom': marginBottom,
                    'few-margin-bottom': fewMarginBottom,
                    'invisible': invisible,
                })}
            >
                {title && <label htmlFor={id}>{title}</label>}
                {children && <label htmlFor={id}>{children}</label>}
                <Controller
                    name={name}
                    isClearable
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            value={defaultValue}
                            classNamePrefix="select-field"
                            dropdownIndicator={false}
                            options={options}
                            placeholder={placeholder}
                            onChange={handleSelectValue}
                            isSearchable={false}
                            maxMenuHeight={200}
                            menuPlacement={topMenu ? 'top' : 'auto'}
                            isDisabled={isDisabled}
                            isOptionDisabled={(option) => option.disabled}
                            styles={
                                type && {
                                    singleValue: (styles, { data }) => ({
                                        ...styles,
                                        ...dot(data.color),
                                    }),
                                    option: (styles, { data }) => ({
                                        ...styles,
                                        ...dot(data.color),
                                    }),
                                }
                            }
                        />
                    )}
                />
                {errorMessage && (
                    <div className="form__field-error-message">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormSelect;
