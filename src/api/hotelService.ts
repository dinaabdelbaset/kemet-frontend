import axiosClient from "./axiosClient";

export interface Hotel {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    price_starts_from?: number;
    location?: string;
    city?: string;
    rating?: number;
    review_count?: number;
    amenities?: string[];
    [key: string]: any; // To allow other dynamic fields
}

export const getHotels = async (): Promise<Hotel[]> => {
    const response = await axiosClient.get("/hotels");
    // Handle both cases: direct array or wrapped in a 'data' object
    if (Array.isArray(response.data)) {
        return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    return [];
};

export const getHotelById = async (id: string | number): Promise<Hotel> => {
    const response = await axiosClient.get(`/hotels/${id}`);
    // Check if the response is wrapped in a 'data' object
    if (response.data?.data) {
        return response.data.data;
    }
    return response.data;
};
