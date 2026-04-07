import axiosClient from "./axiosClient";

export const getTours = async () => {
    const response = await axiosClient.get("/tours");
    return response.data;
};

export const getTourById = async (id: string | number) => {
    const response = await axiosClient.get(`/tours/${id}`);
    return response.data;
};
