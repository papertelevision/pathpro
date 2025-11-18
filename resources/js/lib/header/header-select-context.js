/**
 * External dependencies
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

const HeaderSelectContext = createContext();

export function useHeaderSelectContext() {
    return useContext(HeaderSelectContext);
}

const HeaderSelectContextProvider = ({ children }) => {
    const [selectedValue, setSelectedValue] = useState();

    useEffect(() => {
        if (selectedValue) {
            localStorage.setItem('headerSelectValue', selectedValue);
        }

        const localStorageVal = localStorage.getItem('headerSelectValue');
        if (localStorageVal) {
            setSelectedValue(localStorageVal);
        }

        if (!!!selectedValue) {
            localStorage.removeItem('headerSelectValue');
            setSelectedValue();
        }
    }, [selectedValue]);

    return (
        <HeaderSelectContext.Provider
            value={{
                selectedValue,
                setSelectedValue,
            }}
        >
            {children}
        </HeaderSelectContext.Provider>
    );
};

export default HeaderSelectContextProvider;
