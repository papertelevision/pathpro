/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

const FormTextArea = ({
    id,
    title,
    name,
    rows = 3,
    placeholder,
    marginBottom,
    mediumHeight,
    largeHeight,
    textAreaValue,
    setTextAreaValue,
    hideErrorMessage = false,
    ...props
}) => {
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    const handleUserInput = (e) => {
        setValue(name, e.target.value, { shouldDirty: true });

        setTextAreaValue && setTextAreaValue(e.target.value);
    };

    return (
        <div className="form__default">
            <div
                className={classNames('form__textarea', {
                    'margin-bottom': marginBottom,
                    'medium-height': mediumHeight,
                    'large-height': largeHeight,
                })}
            >
                {title && <label htmlFor={id}>{title}</label>}

                <textarea
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    rows={rows}
                    {...props}
                    {...register(name)}
                    value={textAreaValue}
                    onChange={handleUserInput}
                ></textarea>

                {errorMessage && !hideErrorMessage && (
                    <div className="form__field-error-message">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormTextArea;
