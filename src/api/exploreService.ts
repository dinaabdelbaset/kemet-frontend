import axiosClient from "./axiosClient";

export const getAllExploreData = async () => {
    const response = await axiosClient.get("/all-data");
    return response.data;
};
