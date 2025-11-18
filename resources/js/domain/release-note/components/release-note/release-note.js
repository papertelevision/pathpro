/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import AccordionSection from '@app/components/accordion/accordion-section';
import AccordionHeader from '@app/components/accordion/accordion-header';
import AccordionBody from '@app/components/accordion/accordion-body';
import Box from '@app/components/box/box';
import BoxHeader from '@app/components/box/box-header';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import Modal from '@app/components/modal/modal';
import FormEditTask from '@app/domain/task/components/form-edit-task/form-edit-task';
import { dateFormat } from '@app/lib/date-format';

const ReleaseNote = ({ index, releaseNote, project }) => {
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState({
        state: false,
        task: [],
    });

    const handleModal = () => {
        setIsEditTaskModalOpen({
            state: !isEditTaskModalOpen.state,
            task: [],
        });
    };

    useEffect(() => {
        isEditTaskModalOpen.state &&
            setIsEditTaskModalOpen((pv) => ({
                state: pv.state,
                task: releaseNote.completed_tasks.find(
                    (task) => task.id === pv.task.id
                ),
            }));
    }, [releaseNote]);

    return (
        <>
            <AccordionSection index={index}>
                <AccordionHeader releaseNote>
                    <AccordionHeader.Left>
                        <h4>{`${releaseNote.title} | Released:`}&nbsp;</h4>
                        {dateFormat(
                            releaseNote.created_at,
                            project.date_format,
                            false,
                            true
                        )}
                    </AccordionHeader.Left>
                </AccordionHeader>
                <AccordionBody index={index}>
                    <div className="accordion__group">
                        <h4>Release Notes:</h4>

                        <div className="accordion__group-text">
                            {parse(DOMPurify.sanitize(releaseNote.description))}
                        </div>
                    </div>

                    <div className="accordion__group">
                        <h4>Tasks Completed in this Release:</h4>
                    </div>

                    <div className="accordion__group">
                        {releaseNote.completed_tasks.length > 0 ? (
                            releaseNote.completed_tasks.map((task) => (
                                <Box key={task.id}>
                                    <div className="box__container no-margin is-gray">
                                        <BoxHeader>
                                            <BoxHeader.Left>
                                                <span
                                                    className="box__task-status"
                                                    style={{
                                                        background: `${task.task_type.color}`,
                                                    }}
                                                    data-tooltip-id="tooltip"
                                                    data-tooltip-content={
                                                        task.task_type.title
                                                    }
                                                    data-tooltip-float
                                                    data-tooltip-variant="light"
                                                    data-tooltip-place="bottom"
                                                />
                                                <span className="is-display-block">
                                                    {task.title}
                                                </span>
                                            </BoxHeader.Left>
                                            <BoxHeader.Right>
                                                <BoxButton
                                                    onClick={() => {
                                                        setIsEditTaskModalOpen({
                                                            state: true,
                                                            task: task,
                                                        });
                                                    }}
                                                >
                                                    <Dots />
                                                </BoxButton>
                                            </BoxHeader.Right>
                                        </BoxHeader>
                                    </div>
                                </Box>
                            ))
                        ) : (
                            <p>
                                There are no completed tasks in this release
                                note.
                            </p>
                        )}
                    </div>
                </AccordionBody>
            </AccordionSection>

            {isEditTaskModalOpen.state && (
                <Modal
                    className="full-height"
                    modalIsOpen={isEditTaskModalOpen.state}
                    setIsModalOpen={handleModal}
                    closeModal={handleModal}
                    urlAddress="/release-notes"
                >
                    <Modal.Content>
                        <FormEditTask
                            task={isEditTaskModalOpen.task}
                            projectData={project}
                            taskCommentsData={isEditTaskModalOpen.task.comments}
                            closeModal={handleModal}
                            setIsEditTaskModalOpen={handleModal}
                        />
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
};

export default ReleaseNote;
