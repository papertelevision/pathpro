/**
 * External dependencies
 */
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

/**
 * Internal dependencies
 */
import useRichTextEditor from '@app/components/rich-text-editor/use-rich-text-editor';

const RichTextEditor = ({
    id,
    label,
    name,
    modifier,
    placeholder,
    readOnly = false,
    larger,
    value,
}) => {
    const {
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext();

    const validationError = errors[name] ? errors[name]?.message : null;

    useRichTextEditor({
        id,
        name,
        value,
        readOnly,
        setValue,
        getValues,
        placeholder,
    });

    return (
        <div
            className={classNames('rich-text-editor', {
                [`rich-text-editor--${modifier}`]: modifier,
                'is-disabled': readOnly,
                'is-larger': larger,
            })}
        >
            <label htmlFor="editor">{label}</label>
            <div id={`editor-${id}`} className="rich-text-editor__field"></div>
            {validationError && (
                <div className="rich-text-editor__validation-error">
                    {validationError}
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
