/**
 * Internal dependencies.
 */
import { axiosInstance } from "@app/lib/axios";

export const postData = async (url, payload, config) =>
    await axiosInstance.post(url, payload, config);
