/**
 * External dependencies.
 */
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const axiosInstance = axios;
