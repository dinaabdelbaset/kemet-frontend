import axiosClient from "./axiosClient";

export const getHomeData = async () => {
  try {
    const response = await axiosClient.get("/home");
    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};
