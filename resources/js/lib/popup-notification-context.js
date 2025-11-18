/**
 * External dependencies
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

const PopupNotificationContext = createContext();

export function usePopupNotificationContext() {
    return useContext(PopupNotificationContext);
}

const PopupNotificationContextProvider = ({ children }) => {
    const [isPopupNotificationVisible, setIsPopupNotificationVisible] =
        useState(false);
    const [popupNotificationText, setPopupNotificationText] = useState(false);
    const [popupNotificationColor, setPopupNotificationColor] =
        useState('green');

    useEffect(() => {
        isPopupNotificationVisible &&
            setTimeout(() => {
                setIsPopupNotificationVisible(false);
            }, 3000);
    }, [isPopupNotificationVisible]);

    return (
        <PopupNotificationContext.Provider
            value={{
                isPopupNotificationVisible,
                setIsPopupNotificationVisible,
                popupNotificationText,
                setPopupNotificationText,
                popupNotificationColor,
                setPopupNotificationColor,
            }}
        >
            {children}
        </PopupNotificationContext.Provider>
    );
};

export default PopupNotificationContextProvider;
