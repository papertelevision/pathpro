/**
 * External dependencies
 */
import React from 'react';

const Progressbar = ({ color, value, displayPercentageComplete }) => (
    <div className="progressbar">
        <span className="progressbar-line">
            <span style={{ width: `${value}%`, background: `${color}` }}></span>
        </span>
        {displayPercentageComplete && (
            <span className="progressbar-status" style={{ color: color }}>
                {value}% Complete
            </span>
        )}
    </div>
);

export default Progressbar;
