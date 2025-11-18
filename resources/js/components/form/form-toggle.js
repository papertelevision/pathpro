/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

const FormToggle = ({
    id,
    description,
    name,
    marginBottom,
    title,
    modifier,
    notControlled = false,
    onChange,
    ...props
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const controlledProps = notControlled ? {} : { ...register(name) };

    // Special layout for dual-label modifier
    if (modifier === 'dual-label') {
        return (
            <div
                className={classNames('form__toggle form__toggle--dual-label', {
                    'margin-bottom': marginBottom,
                    'has-error': errors[name],
                })}
            >
                {title && (
                    <label className="form__toggle-label-left" htmlFor={id}>
                        {title}
                    </label>
                )}

                <div className={classNames('form__toggle-container')}>
                    <input
                        type="checkbox"
                        onChange={onChange}
                        {...controlledProps}
                        id={id}
                        {...props}
                    />

                    <span></span>
                </div>

                {description && (
                    <label className="form__toggle-label-right" htmlFor={id}>
                        {description}
                    </label>
                )}
            </div>
        );
    }

    // Default layout
    return (
        <div className="form__default">
            {title && <h5 className="form__default-heading">{title}</h5>}

            <div
                className={classNames('form__toggle', {
                    [`form__toggle--${modifier}`]: modifier,
                    'margin-bottom': marginBottom,
                    'has-error': errors[name],
                })}
            >
                <div className={classNames('form__toggle-container')}>
                    <input
                        type="checkbox"
                        onChange={onChange}
                        {...controlledProps}
                        id={id}
                        {...props}
                    />

                    <span></span>
                </div>

                {description && (
                    <label className="form__toggle-label" htmlFor={id}>
                        {description}
                    </label>
                )}
            </div>
        </div>
    );
};

export default FormToggle;
