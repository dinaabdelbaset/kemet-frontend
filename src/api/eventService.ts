import axiosClient from "./axiosClient";

export const getEvents = async () => {
    const response = await axiosClient.get("/events");
    return response.data;
};

export const getEventById = async (id: string | number) => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
};
