import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف  الخاص بعمليات الحجز (Bookings) وإدارتها
 * ---------------------------------------------------------------------------------
 */

export const createBooking = async (bookingData: any) => {
    const response = await axiosClient.post("/bookings", bookingData);
    return response.data;
};

export const getUserBookings = async () => {
    const response = await axiosClient.get("/user/bookings");
    return response.data;
};

export const cancelBooking = async (bookingId: string | number) => {
    const response = await axiosClient.delete(`/bookings/${bookingId}`);
    return response.data;
};

export const getAdminStats = async () => {
    const response = await axiosClient.get("/admin/stats");
    return response.data;
};

export const getAdminBookings = async () => {
    const response = await axiosClient.get("/admin/bookings");
    return response.data;
};


