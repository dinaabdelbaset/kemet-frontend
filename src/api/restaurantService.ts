import axiosClient from "./axiosClient";

export const getRestaurants = async () => {
    const response = await axiosClient.get("/restaurants");
    let data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    data = data.map((r: any) => {
        const titleLc = (r.name || r.title || "").toLowerCase();
        let newImage = r.image;
        if (titleLc.includes("kadoura") || r.name?.includes("قدورة")) newImage = "/images/restaurants/kadoura.png";
        else if (titleLc.includes("balbaa") || r.name?.includes("بلبع")) newImage = "/images/restaurants/balbaa.png";
        else if (titleLc.includes("fares") || r.name?.includes("فارس")) newImage = "/images/restaurants/fares.png";
        else if (titleLc.includes("masrien") || r.name?.includes("المصريين")) newImage = "/images/restaurants/masrien.png";
        else if (newImage?.includes("unsplash") || newImage?.includes("hotel") || newImage === "placeholder.png") newImage = "/images/restaurants/generic.png";
        
        return { ...r, image: newImage || "/images/restaurants/generic.png", image_url: newImage || "/images/restaurants/generic.png" };
    });
    return data;
};

export const getRestaurantById = async (id: string | number) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    let data = response.data?.data || response.data;
    if (data) {
        const titleLc = (data.name || data.title || "").toLowerCase();
        let newImage = data.image;
        if (titleLc.includes("kadoura") || data.name?.includes("قدورة")) newImage = "/images/restaurants/kadoura.png";
        else if (titleLc.includes("balbaa") || data.name?.includes("بلبع")) newImage = "/images/restaurants/balbaa.png";
        else if (titleLc.includes("fares") || data.name?.includes("فارس")) newImage = "/images/restaurants/fares.png";
        else if (titleLc.includes("masrien") || data.name?.includes("المصريين")) newImage = "/images/restaurants/masrien.png";
        else if (newImage?.includes("unsplash") || newImage?.includes("hotel") || newImage === "placeholder.png") newImage = "/images/restaurants/generic.png";
        
        data.image = newImage || "/images/restaurants/generic.png";
        data.image_url = newImage || "/images/restaurants/generic.png";
    }
    return data;
};
