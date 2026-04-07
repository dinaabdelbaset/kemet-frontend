import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالمحفظة (Wishlist / المفضلة)
 * ---------------------------------------------------------------------------------
 */

export const getWishlist = async () => {
    const response = await axiosClient.get("/wishlist");
    return response.data;
};

export const addToWishlist = async (itemId: string | number, itemType: string) => {
    const response = await axiosClient.post("/wishlist", { item_id: itemId, type: itemType });
    return response.data;
};

export const removeFromWishlist = async (itemId: string | number) => {
    const response = await axiosClient.delete(`/wishlist/${itemId}`);
    return response.data;
};
