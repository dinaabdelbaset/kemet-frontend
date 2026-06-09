import axiosClient from "./axiosClient";

export interface EmergencyService {
    id?: number;
    name: string;
    type: "hospital" | "pharmacy" | "embassy" | "hotline";
    phone: string;
    address?: string;
    city: string;
    latitude?: number;
    longitude?: number;
    details?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export const getEmergencyServices = async (city: string = "All", type: string = "All", adminView: boolean = false): Promise<EmergencyService[]> => {
    const params: Record<string, string> = {};
    if (city && city !== "All") params.city = city;
    if (type && type !== "All") params.type = type;
    if (adminView) params.admin_view = "true";

    const response = await axiosClient.get("/emergency-services", { params });
    if (Array.isArray(response.data)) {
        return response.data;
    }
    return [];
};

export const createEmergencyService = async (data: EmergencyService): Promise<EmergencyService> => {
    const response = await axiosClient.post("/admin/emergency-services", data);
    return response.data.service || response.data;
};

export const updateEmergencyService = async (id: number, data: Partial<EmergencyService>): Promise<EmergencyService> => {
    const response = await axiosClient.put(`/admin/emergency-services/${id}`, data);
    return response.data.service || response.data;
};

export const deleteEmergencyService = async (id: number): Promise<void> => {
    await axiosClient.delete(`/admin/emergency-services/${id}`);
};
