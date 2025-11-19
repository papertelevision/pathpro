/**
 * External dependencies
 */
import { useEffect, useRef } from 'react';
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
    const quillRef = useRef(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        // Prevent re-initialization
        if (isInitializedRef.current) {
            return;
        }

        const editorElement = document.querySelector(`#editor-${id}`);
        if (!editorElement) {
            return;
        }

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

        quillRef.current = quill;
        isInitializedRef.current = true;

        readOnly && quill.disable(true);

        // Initialize with empty value
        const initialValue = value || getValues(name) || '';
        if (initialValue) {
            quill.root.innerHTML = initialValue;
        }

        quill.on('text-change', () => {
            const text = quill.getText().trim();
            const html = text.length > 0 ? quill.root.innerHTML : '';
            setValue(name, html, { shouldValidate: true, shouldDirty: true });
        });

        delete quill.getModule('keyboard').bindings['9'];

        const handleToolbarFocus = () => quill.focus();

        // Get toolbar items specific to this editor instance
        const editorContainer = document.querySelector(`#editor-${id}`);
        const toolbar = editorContainer?.previousElementSibling;
        const toolbarItems = toolbar?.querySelectorAll('button') || [];

        toolbarItems.forEach((item) => {
            item.addEventListener('focus', handleToolbarFocus);
        });

        return () => {
            toolbarItems.forEach((item) => {
                item.removeEventListener('focus', handleToolbarFocus);
            });
            isInitializedRef.current = false;
        };
    }, [id]);

    // Watch for form resets and clear the editor
    useEffect(() => {
        if (quillRef.current && isInitializedRef.current) {
            const currentValue = getValues(name);
            const editorText = quillRef.current.getText().trim();

            // If form value is empty but editor has text, clear the editor
            if ((!currentValue || currentValue === '') && editorText) {
                quillRef.current.setText('');
                quillRef.current.blur(); // Remove focus to hide cursor
            }
        }
    }, [value, name, getValues]);
};

export default useRichTextEditor;
