import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالدفع المالي والبوابات (Payments via Stripe, PayPal, etc.)
 * ---------------------------------------------------------------------------------
 */

export const processPayment = async (paymentData: any) => {
    const response = await axiosClient.post("/payment/process", paymentData);
    return response.data;
};

export const verifyPaymentStatus = async (transactionId: string) => {
    const response = await axiosClient.get(`/payment/status/${transactionId}`);
    return response.data;
};
