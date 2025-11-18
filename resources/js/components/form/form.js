/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FormColLeft from '@app/components/form/form-col-left';
import FormColRight from '@app/components/form/form-col-right';
import FormContent from '@app/components/form/form-content';
import FormFooter from '@app/components/form/form-footer';

const Form = ({ children, encType, modifier, className, ...props }) => (
    <form
        className={classNames('form', className, {
            [`form--${modifier}`]: modifier,
        })}
        {...props}
        encType={encType}
    >
        {children}
    </form>
);

Form.Content = FormContent;
Form.ColLeft = FormColLeft;
Form.ColRight = FormColRight;
Form.Footer = FormFooter;

export default Form;
