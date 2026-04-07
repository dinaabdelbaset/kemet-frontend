import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالمقالات وأدلة السفر (Travel Guides & Blogs)
 * ---------------------------------------------------------------------------------
 */

export const getTravelGuides = async () => {
    const response = await axiosClient.get("/blogs");
    return response.data;
};

export const getGuideDetails = async (id: string | number) => {
    const response = await axiosClient.get(`/blogs/${id}`);
    return response.data;
};
