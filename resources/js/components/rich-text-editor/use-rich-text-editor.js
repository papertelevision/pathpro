/**
 * External dependencies
 */
import { useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

const useRichTextEditor = ({
    id,
    name,
    value,
    readOnly,
    setValue,
    getValues,
    placeholder,
}) => {
    useEffect(() => {
        const quill = new Quill(`#editor-${id}`, {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    [{ list: 'bullet' }, { list: 'ordered' }],
                    ['blockquote'],
                    ['link'],
                ],
            },
            placeholder: placeholder,
            theme: 'snow',
        });

        readOnly && quill.disable(true);

        quill.on('text-change', () => {
            setValue(name, quill.root.innerHTML);
        });

        quill.root.innerHTML = value || getValues(name);

        delete quill.getModule('keyboard').bindings['9'];

        const handleToolbarFocus = () => quill.focus();

        const toolbarItems = document.querySelectorAll('.ql-toolbar button');
        toolbarItems.forEach((item) => {
            item.addEventListener('focus', handleToolbarFocus);
        });

        return () =>
            toolbarItems.forEach((item) => {
                item.removeEventListener('focus', handleToolbarFocus);
            });
    }, [id, name, value, readOnly, setValue, getValues, placeholder]);
};

export default useRichTextEditor;
