/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useFormContext, Controller } from 'react-hook-form';
import classNames from 'classnames';

const MultiReactSelect = ({
    id,
    name,
    title,
    placeholder,
    medium,
    data,
    selectedValues,
    children,
    isDisabled,
}) => {
    const {
        formState: { errors },
        control,
        setValue,
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    useEffect(() => {
        const modifiedData = selectedValues
            ? selectedValues.map((item) => {
                  return {
                      value: item.id,
                      label: item?.title || item?.username,
                  };
              })
            : [];

        setValue(name, modifiedData);
    }, [selectedValues]);

    const handleChange = (values) => {
        setValue(name, values, { shouldDirty: true });
    };

    const optionsArray =
        data &&
        data.map((item) => ({
            label: item?.title || item?.username,
            value: item.id,
        }));

    return (
        <div
            className={classNames('form__default', {
                medium: medium,
            })}
        >
            <div className="form__field">
                {title && <label htmlFor={id}>{title}</label>}
                {children && <label htmlFor={id}>{children}</label>}

                <Controller
                    name={name}
                    isClearable
                    control={control}
                    render={({ field }) => (
                        <Select
                            classNamePrefix="multi-react-select"
                            dropdownIndicator={false}
                            isMulti
                            {...field}
                            onChange={handleChange}
                            styles={{
                                menuList: (provided, _) => ({
                                    ...provided,
                                    maxHeight: 200,
                                }),
                            }}
                            options={optionsArray}
                            placeholder={placeholder}
                            isDisabled={isDisabled}
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

export default MultiReactSelect;
