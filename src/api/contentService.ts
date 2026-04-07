import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالمحتوى (CMS Content)
 * Hero Slides, Navbar, Why Choose Us, Footer, Attractions, Pages, FAQs
 * ---------------------------------------------------------------------------------
 */

export const getPageContent = async (pageSlug: string) => {
    const response = await axiosClient.get(`/content/pages/${pageSlug}`);
    return response.data;
};

export const getHelpCenterFaqs = async () => {
    const response = await axiosClient.get("/content/faqs");
    return response.data;
};

export const getHeroSlides = async () => {
    const response = await axiosClient.get("/content/hero-slides");
    return response.data;
};

export const getNavItems = async () => {
    const response = await axiosClient.get("/content/nav-items");
    return response.data;
};

export const getWhyChooseUs = async () => {
    const response = await axiosClient.get("/content/why-choose-us");
    return response.data;
};

export const getFooterData = async () => {
    const response = await axiosClient.get("/content/footer");
    return response.data;
};

export const getAttractions = async () => {
    const response = await axiosClient.get("/content/attractions");
    return response.data;
};

export const getAttraction = async (slug: string) => {
    const response = await axiosClient.get(`/content/attractions/${slug}`);
    return response.data;
};

export const getHomeMarquee = async () => {
    const response = await axiosClient.get("/content/home-marquee");
    return response.data;
};

export const getActivityFilters = async () => {
    const response = await axiosClient.get("/content/activity-filters");
    return response.data;
};
