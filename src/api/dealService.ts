import axiosClient from "./axiosClient";

export interface Deal {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    price_starts_from?: number;
    location: string;
    city?: string;
    rating: number;
    review_count: number;
    duration?: string;
    [key: string]: any;
}

export const getDeals = async (): Promise<Deal[]> => {
    const response = await axiosClient.get("/deals");
    if (Array.isArray(response.data)) {
        return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    return [];
};

export const getDealById = async (id: string | number): Promise<Deal> => {
    const response = await axiosClient.get(`/deals/${id}`);
    if (response.data?.data) {
        return response.data.data;
    }
    return response.data;
};
