/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

const FormCheckbox = ({
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

    return (
        <div className="form__default">
            {title && <h5 className="form__default-heading">{title}</h5>}

            <div
                className={classNames('form__checkbox', {
                    [`form__checkbox--${modifier}`]: modifier,
                    'margin-bottom': marginBottom,
                    'has-error': errors[name],
                })}
            >
                <input
                    type="checkbox"
                    onChange={onChange}
                    {...controlledProps}
                    id={id}
                    {...props}
                />

                {description && (
                    <label className="form__checkbox-label" htmlFor={id}>
                        {description}
                    </label>
                )}
            </div>
        </div>
    );
};

export default FormCheckbox;
