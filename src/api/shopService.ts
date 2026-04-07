import axiosClient from "./axiosClient";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    created_at?: string;
}

export interface OrderItemPayload {
    product_id: number;
    quantity: number;
    price: number;
}

export interface OrderPayload {
    hotel_name: string;
    room_number?: string;
    phone: string;
    delivery_date: string;
    delivery_time: string;
    payment_method: string;
    items: OrderItemPayload[];
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await axiosClient.get("/products");
    return response.data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
};

export const placeOrder = async (orderData: OrderPayload) => {
    const response = await axiosClient.post("/orders", orderData);
    return response.data;
};

export const getUserOrders = async () => {
    const response = await axiosClient.get("/orders/my-orders");
    return response.data;
};
