/**
 * External dependencies
 */
import React, { Fragment, useEffect } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import AccordionHeaderLeft from '@app/components/accordion/accordion-header-left';
import AccordionHeaderRight from '@app/components/accordion/accordion-header-right';
import BoxButton from '@app/components/box/box-button';
import ButtonIcon from '@app/components/button/button-icon';
import Icon from '@app/components/icon/icon';
import AccordionFooter from '@app/components/accordion/accordion-footer';
import { useAccordionSection } from '@app/components/accordion/api/accordion-context';

const AccordionHeader = ({
    children,
    index,
    suggestions,
    replies,
    project,
    releaseNote,
    repeater,
    className,
    handleAction,
    DragAndDropProvided,
    showActionButtons = false,
}) => {
    const { isActive, handleChangeSection, activeSection, setActiveSection } =
        useAccordionSection();

    useEffect(() => {
        if ((releaseNote || project) && !activeSection) {
            setActiveSection(0);
        }
    }, []);

    return (
        <Fragment>
            <div
                className={classNames('accordion__header', {
                    suggestions: suggestions,
                })}
            >
                <AccordionHeaderLeft className={className}>
                    {children}
                </AccordionHeaderLeft>

                {!suggestions && !project && !releaseNote && !repeater && (
                    <AccordionHeader.Right>
                        <BoxButton
                            subtask
                            onClick={() => handleChangeSection(index)}
                        >
                            <span>Details</span>
                            {!isActive(index) ? (
                                <Icon type="dropdown" />
                            ) : (
                                <div className="box__hide-subtasks">
                                    <Icon type="dropdown" />
                                </div>
                            )}
                        </BoxButton>
                        {showActionButtons && (
                            <ButtonIcon
                                iconType="simple_pencil"
                                color="lighter-gray"
                                onClick={() => handleAction()}
                            />
                        )}
                        <div {...DragAndDropProvided?.dragHandleProps}>
                            {showActionButtons && (
                                <ButtonIcon iconType="dragdrop" color="gray" />
                            )}
                        </div>
                    </AccordionHeader.Right>
                )}

                {project && (
                    <AccordionHeader.Right>
                        <BoxButton
                            subtask
                            onClick={() => handleChangeSection(index)}
                        >
                            <span>Show Member Permissions</span>
                            {!isActive(index) ? (
                                <Icon type="dropdown" />
                            ) : (
                                <div className="box__hide-subtasks">
                                    <Icon type="dropdown" />
                                </div>
                            )}
                        </BoxButton>
                    </AccordionHeader.Right>
                )}

                {releaseNote && (
                    <AccordionHeader.Right>
                        <BoxButton
                            subtask
                            onClick={() => handleChangeSection(index)}
                        >
                            {!isActive(index) ? (
                                <Icon
                                    type="dropdown"
                                    width="18px"
                                    height="15px"
                                />
                            ) : (
                                <div className="box__hide-subtasks">
                                    <Icon
                                        type="dropdown"
                                        width="18px"
                                        height="15px"
                                    />
                                </div>
                            )}
                        </BoxButton>
                    </AccordionHeader.Right>
                )}

                {repeater && (
                    <AccordionHeader.Right>
                        <button
                            type="button"
                            className={isActive(index) ? 'is-open' : ''}
                            onClick={() => handleChangeSection(index)}
                        ></button>
                    </AccordionHeader.Right>
                )}
            </div>

            {replies && (
                <AccordionFooter>
                    <BoxButton
                        subtask
                        icon
                        onClick={() => handleChangeSection(index)}
                    >
                        Show/Hide Replies ({replies.length})
                    </BoxButton>
                </AccordionFooter>
            )}
        </Fragment>
    );
};

AccordionHeader.Left = AccordionHeaderLeft;
AccordionHeader.Right = AccordionHeaderRight;

export default AccordionHeader;
