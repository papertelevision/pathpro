/**
 * External dependencies
 */
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { findLastIndex, kebabCase } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import visibility from '@/images/visibility.png';
import visibilityWhite from '@/images/visibility-white.png';
import filter from '@/images/filter.png';
import fourSquares from '@/images/four-squares.png';
import Icon from '@app/components/icon/icon';

const Filter = ({
    type,
    data,
    filterValue,
    setFilterValue,
    onChange,
    tooltipText,
    showWhiteImg = false,
}) => {
    const ref = useRef();
    const [isVisible, setIsVisible] = useState(false);

    const handleOnChange = (value) => {
        setFilterValue(value);
        onChange && onChange(value);
        setIsVisible(false);
    };

    const handleClickOutsideFilterSection = (e) =>
        !ref.current?.contains(e.target) && setIsVisible(false);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideFilterSection);
        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutsideFilterSection
            );
    }, []);

    const options =
        type === 'helperMenu'
            ? [...data]
            : [{ label: 'View All', icon: fourSquares }, ...data];

    return (
        <div
            ref={ref}
            className={classNames('filter', {
                [`filter--${kebabCase(type)}`]: type,
            })}
            onClick={() => setIsVisible(!isVisible)}
        >
            <button className="filter-button">
                {type === 'helperMenu' ? (
                    <>
                        Help <Icon type="dropdown" />
                    </>
                ) : (
                    <img
                        src={
                            type === 'visibility'
                                ? showWhiteImg
                                    ? visibilityWhite
                                    : visibility
                                : filter
                        }
                        data-tooltip-id="tooltip"
                        data-tooltip-variant="light"
                        data-tooltip-place="bottom"
                        data-tooltip-content={tooltipText}
                        data-tooltip-float
                    />
                )}
            </button>
            <div
                className={classNames('filter__content', {
                    'is-active': isVisible,
                })}
            >
                <ul>
                    {options.map((item, idx) => (
                        <li
                            key={idx}
                            className={classNames('', {
                                'is-active':
                                    type === 'helperMenu'
                                        ? false
                                        : String(filterValue) ===
                                          String(item.id),
                                'has-border':
                                    findLastIndex(
                                        options,
                                        (o) => 'icon' in o
                                    ) === idx,
                            })}
                        >
                            {type === 'helperMenu' ? (
                                item.is_tour_option ? (
                                    <button
                                        onClick={() => {
                                            localStorage.setItem(
                                                'onboardingSkipped',
                                                false
                                            );
                                            localStorage.setItem(
                                                'onboardingRestarted',
                                                true
                                            );
                                            window.location.replace(item.value);
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <NavLink
                                        to={item.value}
                                        state={{
                                            resetOnboarding:
                                                item.is_tour_option,
                                        }}
                                    >
                                        {item.label}
                                    </NavLink>
                                )
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOnChange(item.id);
                                    }}
                                >
                                    {type !== 'visibility' && item.icon && (
                                        <img src={item.icon} />
                                    )}
                                    {item.color && (
                                        <span
                                            className="filter-box"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        ></span>
                                    )}
                                    {item.label || item.title}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Filter;
