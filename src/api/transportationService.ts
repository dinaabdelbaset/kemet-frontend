import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالمواصلات (Transportation & Flights/Cars)
 * ---------------------------------------------------------------------------------
 */

export const getTransportationList = async (filters: any) => {
    const response = await axiosClient.get("/transportation", { params: filters });
    return response.data;
};

export const getTransportationDetails = async (id: string | number) => {
    const response = await axiosClient.get(`/transportation/${id}`);
    return response.data;
};
