import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Interfaces
export interface HajjUmrahPackage {
  id: number;
  name_en: string;
  name_ar: string;
  price: number;
  hotel_makkah_en: string;
  hotel_makkah_ar: string;
  hotel_madinah_en: string;
  hotel_madinah_ar: string;
  hotel_makkah_id?: number;
  hotel_madinah_id?: number;
  flight_id?: number;
  transportation_id?: number;
  hotel_makkah?: any;
  hotel_madinah?: any;
  flight?: any;
  transportation?: any;
  duration_days: number;
  description_en: string;
  description_ar: string;
  image?: string;
  features_en?: string[];
  features_ar?: string[];
  created_at?: string;
  updated_at?: string;
}

// Fetch all Hajj & Umrah Packages
export const getHajjUmrahPackages = async (): Promise<HajjUmrahPackage[]> => {
  const response = await axios.get(`${API_BASE}/hajj-umrah/packages`);
  return response.data;
};

// Admin authentication headers
const getAdminHeaders = () => {
  const token = localStorage.getItem("token");
  const adminKey = localStorage.getItem("kemet_admin_key") || "kemet-admin-2026-secret";
  return {
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": adminKey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Admin CRUD functions
export const createHajjUmrahPackage = async (data: Partial<HajjUmrahPackage>): Promise<HajjUmrahPackage> => {
  const response = await axios.post(`${API_BASE}/admin/hajj-umrah/packages`, data, getAdminHeaders());
  return response.data.package;
};

export const updateHajjUmrahPackage = async (id: number, data: Partial<HajjUmrahPackage>): Promise<HajjUmrahPackage> => {
  const response = await axios.put(`${API_BASE}/admin/hajj-umrah/packages/${id}`, data, getAdminHeaders());
  return response.data.package;
};

export const deleteHajjUmrahPackage = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/admin/hajj-umrah/packages/${id}`, getAdminHeaders());
};
