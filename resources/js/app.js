/**
 * External dependencies
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'react-tooltip/dist/react-tooltip.css';
import Routes from '@app/routes';

/**
 * Internal dependencies
 */
import '../scss/style.scss';
import PermissionsContextApiProvider from '@app/lib/permissions-context-api';
import QueryContextApiProvider from '@app/lib/query-context-api';
import HeaderSelectContextProvider from '@app/lib/header/header-select-context';
import PopupNotificationContextProvider from '@app/lib/popup-notification-context';

Modal.setAppElement('#modal');

const queryClient = new QueryClient();
const stripePromise = loadStripe(process.env.MIX_STRIPE_KEY);

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <Elements stripe={stripePromise}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <HeaderSelectContextProvider>
                    <PermissionsContextApiProvider>
                        <QueryContextApiProvider>
                            <PopupNotificationContextProvider>
                                <Routes />
                            </PopupNotificationContextProvider>
                        </QueryContextApiProvider>
                    </PermissionsContextApiProvider>
                </HeaderSelectContextProvider>
                {process.env.MIX_APP_ENV === 'local' && <ReactQueryDevtools />}
            </BrowserRouter>
        </QueryClientProvider>
    </Elements>
    // </StrictMode>
);
