import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالبحث المتقدم (Global Search Filter)
 * ---------------------------------------------------------------------------------
 */

export const globalSearch = async (query: string) => {
    const response = await axiosClient.get("/search", { params: { q: query } });
    return response.data;
};
