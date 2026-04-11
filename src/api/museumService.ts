import axiosClient from "./axiosClient";

export const getMuseums = async () => {
    const response = await axiosClient.get("/museums");
    return response.data;
};

export const getMuseumById = async (id: string | number) => {
    const response = await axiosClient.get(`/museums/${id}`);
    return response.data;
};
