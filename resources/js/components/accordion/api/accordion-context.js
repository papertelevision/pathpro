/**
 * External dependencies
 */
import React, {
    Children,
    cloneElement,
    createContext,
    useContext,
    useState,
} from 'react';

const AccordionContext = createContext();

export function useAccordionSection() {
    return useContext(AccordionContext);
}

const AccordionContextProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState();

    const isActive = (component) => component === activeSection;

    const handleChangeSection = (component) => {
        setActiveSection((prevActiveSection) =>
            prevActiveSection === component ? null : component
        );
    };

    return (
        <AccordionContext.Provider
            value={{
                isActive,
                handleChangeSection,
                activeSection,
                setActiveSection,
            }}
        >
            {Children.map(children, (child, idx) => {
                return cloneElement(child, {
                    ...child.props,
                    index: idx,
                });
            })}
        </AccordionContext.Provider>
    );
};

export default AccordionContextProvider;
