import axiosClient from "./axiosClient";

export interface Activity {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    location: string;
    rating: number;
    review_count: number;
}

export const getActivities = async (): Promise<Activity[]> => {
    const response = await axiosClient.get("/activities");
    return response.data;
};

export const getActivityById = async (id: string | number): Promise<Activity> => {
    const response = await axiosClient.get(`/activities/${id}`);
    return response.data;
};
