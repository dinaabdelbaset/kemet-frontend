import axiosClient from "./axiosClient";

export interface ReviewPayload {
    rating: number;
    comment: string;
}

export const getReviews = async (itemType: string, itemId: number | string) => {
    const response = await axiosClient.get(`/reviews/${itemType}/${itemId}`);
    return response.data;
};

export const getAllReviews = async () => {
    const response = await axiosClient.get('/reviews');
    return response.data;
};

// Requires Auth token
export const submitReview = async (itemType: string, itemId: number | string, data: ReviewPayload) => {
    const response = await axiosClient.post(`/reviews/${itemType}/${itemId}`, data);
    return response.data;
};
