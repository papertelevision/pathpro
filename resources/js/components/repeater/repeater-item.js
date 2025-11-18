/**
 * External dependencies.
 */
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { useFormContext } from 'react-hook-form';

/**
 * Internal dependencies.
 */
import ButtonIcon from '@app/components/button/button-icon';
import AccordionBody from '@app/components/accordion/accordion-body';
import AccordionHeader from '@app/components/accordion/accordion-header';
import AccordionSection from '@app/components/accordion/accordion-section';

const RepeaterItem = ({
    id,
    url,
    index,
    label,
    cssClass,
    onRemoveClick,
    openUrlInNewTab,
}) => {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const hasValidationError = (name) =>
        errors?.menu_links &&
        errors.menu_links[index] &&
        errors.menu_links[index][name];

    return (
        <Draggable key={id} index={index} draggableId={`repeater-item-${id}`}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    className="repeater__item"
                    {...provided.draggableProps}
                >
                    <AccordionSection
                        index={index}
                        className={
                            errors?.menu_links && errors.menu_links[index]
                                ? 'has-error'
                                : ''
                        }
                    >
                        <AccordionHeader repeater>
                            <div
                                {...provided.dragHandleProps}
                                className="dots dots--draggable"
                            >
                                <div className="dots__group">
                                    <span className="dots__dot"></span>
                                    <span className="dots__dot"></span>
                                    <span className="dots__dot"></span>
                                </div>
                                <div className="dots__group">
                                    <span className="dots__dot"></span>
                                    <span className="dots__dot"></span>
                                    <span className="dots__dot"></span>
                                </div>
                            </div>
                            {watch(`menu_links[${index}].label`) && (
                                <h4>{watch(`menu_links[${index}].label`)}</h4>
                            )}
                        </AccordionHeader>
                        <AccordionBody index={index}>
                            <div
                                className={classNames(
                                    'repeater__item-textfield',
                                    {
                                        'has-error':
                                            hasValidationError('label'),
                                    }
                                )}
                            >
                                <label htmlFor={`label[${index}]`}>Label</label>
                                <input
                                    type="text"
                                    defaultValue={label}
                                    id={`label[${index}]`}
                                    {...register(`menu_links[${index}].label`)}
                                />
                            </div>
                            <div
                                className={classNames(
                                    'repeater__item-textfield',
                                    { 'has-error': hasValidationError('url') }
                                )}
                            >
                                <label htmlFor={`url[${index}]`}>URL</label>
                                <input
                                    type="text"
                                    id={`url[${index}]`}
                                    defaultValue={url}
                                    {...register(`menu_links[${index}].url`)}
                                />
                            </div>
                            <div className="repeater__item-checkbox">
                                <input
                                    type="checkbox"
                                    id={`open_url_in_new_tab[${index}]`}
                                    defaultChecked={openUrlInNewTab}
                                    {...register(
                                        `menu_links[${index}].open_url_in_new_tab`
                                    )}
                                />
                                <label
                                    htmlFor={`open_url_in_new_tab[${index}]`}
                                >
                                    Open in new tab
                                </label>
                            </div>
                            <div
                                className={classNames(
                                    'repeater__item-textfield',
                                    {
                                        'has-error':
                                            hasValidationError('css_class'),
                                    }
                                )}
                            >
                                <label htmlFor={`css_class[${index}]`}>
                                    CSS Class (optional)
                                </label>
                                <input
                                    type="text"
                                    id={`css_class[${index}]`}
                                    defaultValue={cssClass}
                                    {...register(
                                        `menu_links[${index}].css_class`
                                    )}
                                />
                            </div>
                        </AccordionBody>
                    </AccordionSection>
                    <ButtonIcon iconType="trash" onClick={onRemoveClick} />
                </div>
            )}
        </Draggable>
    );
};

export default RepeaterItem;
