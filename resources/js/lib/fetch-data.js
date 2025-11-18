/**
 * Internal dependencies.
 */
import { axiosInstance } from "@app/lib/axios";

const client = axiosInstance;

export default client;

export const fetchData = async (url, paginate) => {
    const { data } = await axiosInstance.get(url);

    return paginate ? data : data?.data || data;
};

