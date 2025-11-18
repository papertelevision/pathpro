/**
 * External dependencies
 */
import { useState, forwardRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

const ProjectHeader = forwardRef(({ header, setHeight }, ref) => {
    const [isNavToggled, setIsNavToggled] = useState(false);

    const handleToggleNav = () => setIsNavToggled(!isNavToggled);

    useEffect(() => {
        const header = ref.current;
        if (!header) return;
        const { marginTop, marginBottom } = window.getComputedStyle(header);

        setHeight(
            header.offsetHeight +
                parseFloat(marginBottom) +
                parseFloat(marginTop)
        );

        return () => setHeight(0);
    }, [ref]);

    return (
        <header
            ref={ref}
            className={classNames('project-header', {
                'has-active-nav': isNavToggled,
            })}
        >
            <div className="project-header__shell">
                <div className="project-header__container">
                    {header.logo && (
                        <div className="project-header__logo">
                            <NavLink
                                to={header.logo_url}
                                target={
                                    header.open_logo_url_in_new_tab
                                        ? '_blank'
                                        : '_self'
                                }
                            >
                                <img src={header.logo} />
                            </NavLink>
                        </div>
                    )}
                    {header.menu_links?.length > 0 && (
                        <nav className="project-header__menu-links">
                            {header.menu_links.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.url}
                                    target={
                                        link.open_url_in_new_tab
                                            ? '_blank'
                                            : '_self'
                                    }
                                    className={link.css_class}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    )}
                    <button
                        className="toggle-project-header-nav"
                        onClick={handleToggleNav}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
        </header>
    );
});

export default ProjectHeader;
