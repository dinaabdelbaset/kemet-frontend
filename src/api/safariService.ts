import axiosClient from "./axiosClient";

export interface Safari {
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
    [key: string]: any;
}

export const getSafaris = async (): Promise<Safari[]> => {
    const response = await axiosClient.get("/safaris");
    if (Array.isArray(response.data)) {
        return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    return [];
};

export const getSafariById = async (id: string | number): Promise<Safari> => {
    const response = await axiosClient.get(`/safaris/${id}`);
    if (response.data?.data) {
        return response.data.data;
    }
    return response.data;
};
