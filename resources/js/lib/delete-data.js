/**
 * Internal dependencies.
 */
import { axiosInstance } from "@app/lib/axios";

export const deleteData = async (url, payload) =>
    await axiosInstance.delete(url, { data: payload });
