/**
 * External dependencies
 */
import React from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

const FormField = ({
    id,
    name,
    type = 'text',
    title,
    smaller,
    textColor,
    children,
    placeholder,
    ...props
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    return (
        <div className="form__default">
            <div
                className={classNames('form__field', textColor, {
                    smaller: smaller,
                })}
            >
                {title && <label htmlFor={id}>{title}</label>}
                {children && <label htmlFor={id}>{children}</label>}

                <input
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    {...register(name)}
                    {...props}
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

export default FormField;
