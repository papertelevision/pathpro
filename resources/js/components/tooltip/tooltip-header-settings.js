/**
 * External dependencies
 */
import { NavLink } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const documentation = 'https://pathpro.co/articles/custom-header-settings/';

const TooltipHeaderSettings = () => (
    <ReactTooltip
        id="tooltip-header-settings"
        place="bottom-start"
        variant="light"
        className="react-tooltip--header-settings"
        offset={17}
        opacity={1}
        float
        clickable
        content={
            <div>
                <p>
                    Enable this setting to add a custom header, complete with
                    links, your logo, and buttons, which will be displayed on
                    the front-facing view of your Project. This lets you display
                    this Project directly into your site in a seamless manner.
                    <br />
                    <b>Note:</b> For tips on setting up your custom header,
                    along with a list of CSS classes, etc. please{' '}
                    <NavLink to={documentation} target="_blank">
                        View Our Documentation
                    </NavLink>
                    .
                </p>
            </div>
        }
    />
);

export default TooltipHeaderSettings;
