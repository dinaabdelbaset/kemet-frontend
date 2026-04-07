import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالدعم الفني والتواصل (Support, Contact Us, Newsletter)
 * ---------------------------------------------------------------------------------
 */

export const submitContactForm = async (contactData: { name: string; email: string; message: string }) => {
    const response = await axiosClient.post("/support/contact", contactData);
    return response.data;
};

export const subscribeNewsletter = async (email: string) => {
    const response = await axiosClient.post("/newsletter/subscribe", { email });
    return response.data;
};
