import axiosClient from "./axiosClient";

export const getRestaurants = async () => {
    const response = await axiosClient.get("/restaurants");
    return response.data;
};

export const getRestaurantById = async (id: string | number) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    return response.data;
};
