/**
 * External dependencies.
 */
import { DragDropContext } from 'react-beautiful-dnd';

/**
 * Internal dependencies.
 */
import Button from '@app/components/button/button';
import Accordion from '@app/components/accordion/accordion';
import RepeaterItem from '@app/components/repeater/repeater-item';
import { StrictModeDroppable } from '@app/lib/strict-mode-droppable';

const Repeater = ({ fields, addField, removeField, moveField }) => {
    const onDragEnd = ({ destination, source }) => {
        if (
            destination &&
            (destination.droppableId !== source.droppableId ||
                destination.index !== source.index)
        ) {
            moveField(source.index, destination.index);
        }
    };

    return (
        <div className="repeater">
            <h3>Menu Links</h3>
            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable
                    type="row"
                    direction="vertical"
                    droppableId="repeater-accordion"
                >
                    {(provided) => (
                        <Accordion active ref={provided.innerRef}>
                            {fields.map(
                                (
                                    {
                                        id,
                                        url,
                                        label,
                                        css_class,
                                        open_url_in_new_tab,
                                    },
                                    index
                                ) => (
                                    <RepeaterItem
                                        id={id}
                                        key={id}
                                        url={url}
                                        index={index}
                                        label={label}
                                        onRemoveClick={() => removeField(index)}
                                        cssClass={css_class}
                                        openUrlInNewTab={open_url_in_new_tab}
                                    />
                                )
                            )}
                            {provided.placeholder}
                        </Accordion>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
            <Button
                type="button"
                modifier="rectangular"
                color="is-dark"
                onClick={() =>
                    addField({
                        url: '',
                        order: fields.length + 1,
                        label: '',
                        css_class: '',
                        open_url_in_new_tab: false,
                    })
                }
            >
                Add Item
            </Button>
        </div>
    );
};

export default Repeater;
