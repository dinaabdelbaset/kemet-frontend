import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بجلب الوجهات والرحلات (Destinations, Tours, Packages)
 * ---------------------------------------------------------------------------------
 */

export const getHotels = async () => {
    const response = await axiosClient.get("/hotels");
    return response.data;
};

export const getTours = async () => {
    const response = await axiosClient.get("/tours");
    return response.data;
};

export const generateAiTrip = async (reqData: any) => {
    const response = await axiosClient.post("/ai/planner", reqData);
    return response.data;
};

export const getTravelPackages = async () => {
    const response = await axiosClient.get("/deals");
    return response.data;
};
