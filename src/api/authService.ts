import axiosClient from "./axiosClient";

export const login = async (credentials: { email: string; password: string }) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axiosClient.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axiosClient.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (profileData: any) => {
    const isFormData = profileData instanceof FormData;
    const response = await axiosClient.post("/auth/profile/update", profileData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
};

export const socialLogin = async (data: { email: string; name: string; provider: string }) => {
    const response = await axiosClient.post("/auth/social-login", data);
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await axiosClient.post("/auth/forgot-password", { email });
    return response.data;
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
    const response = await axiosClient.post("/auth/verify-otp", data);
    return response.data;
};

export const resetPassword = async (data: { email: string; otp: string; password: string; password_confirmation: string }) => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
};
