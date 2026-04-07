import axiosClient from "./axiosClient";

export const getDestinations = async () => {
    const response = await axiosClient.get("/destinations");
    return response.data;
};
