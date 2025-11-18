/**
 * External dependencies
 */
import { React, useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';

const FormColorPicker = ({
    title = 'Header Color',
    name,
    displayColor,
    setDisplayColor,
    modifier,
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const wrapperRef = useRef();
    const { register, setValue } = useFormContext();

    const handleDisplayColorPickerClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleColorChange = (color) => {
        setValue(name, color.hex, { shouldDirty: true });

        setDisplayColor(color.hex);
    };

    const handleClick = (e) => {
        if (wrapperRef.current?.contains(e.target)) {
            return;
        }
        setDisplayColorPicker(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div className="form__default">
            <div
                className={classNames('form-color-picker', {
                    [`form-color-picker--${modifier}`]: modifier,
                })}
                ref={wrapperRef}
            >
                <label htmlFor="form-color-picker__field">{title}</label>
                <button
                    id="header_color"
                    type="button"
                    onClick={handleDisplayColorPickerClick}
                    style={{ background: `${displayColor}` }}
                >
                    <Icon type="color_picker" />
                </button>
                {displayColorPicker && (
                    <SketchPicker
                        {...register(name)}
                        className="form-color-picker__field"
                        color={displayColor}
                        onChange={handleColorChange}
                    />
                )}
            </div>
        </div>
    );
};

export default FormColorPicker;
