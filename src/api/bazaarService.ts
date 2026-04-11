import axiosClient from "./axiosClient";

export const getBazaars = async () => {
    const response = await axiosClient.get("/bazaars");
    return response.data;
};

export const getBazaarById = async (id: string | number) => {
    const response = await axiosClient.get(`/bazaars/${id}`);
    return response.data;
};
