import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export interface ArabCountry {
  id: number;
  name_en: string;
  name_ar: string;
  code: string;
  flag: string;
  image: string;
  description_en: string;
  description_ar: string;
  landmarks_count?: number;
  currency_code?: string;
  currency_name_ar?: string;
  currency_name_en?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArabLandmark {
  id: number;
  country_id: number;
  name_en: string;
  name_ar: string;
  location_en: string;
  location_ar: string;
  category: "historical" | "modern" | "nature";
  image: string;
  description_en: string;
  description_ar: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  ticket_price?: number;
  country?: ArabCountry;
  created_at?: string;
  updated_at?: string;
}

// Fetch all Arab Countries
export const getArabCountries = async (): Promise<ArabCountry[]> => {
  const response = await axios.get(`${API_BASE}/arab-world/countries`);
  return response.data;
};

// Fetch landmarks with filters
export const getArabLandmarks = async (
  countryId?: string | number,
  category?: string
): Promise<ArabLandmark[]> => {
  const params: Record<string, any> = {};
  if (countryId && countryId !== "All") params.country_id = countryId;
  if (category && category !== "All") params.category = category;

  const response = await axios.get(`${API_BASE}/arab-world/landmarks`, { params });
  return response.data;
};

// Admin CRUD functions
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

export const createArabCountry = async (data: Partial<ArabCountry>): Promise<ArabCountry> => {
  const response = await axios.post(`${API_BASE}/admin/arab-world/countries`, data, getAdminHeaders());
  return response.data.country;
};

export const updateArabCountry = async (id: number, data: Partial<ArabCountry>): Promise<ArabCountry> => {
  const response = await axios.put(`${API_BASE}/admin/arab-world/countries/${id}`, data, getAdminHeaders());
  return response.data.country;
};

export const deleteArabCountry = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/admin/arab-world/countries/${id}`, getAdminHeaders());
};

export const createArabLandmark = async (data: Partial<ArabLandmark>): Promise<ArabLandmark> => {
  const response = await axios.post(`${API_BASE}/admin/arab-world/landmarks`, data, getAdminHeaders());
  return response.data.landmark;
};

export const updateArabLandmark = async (id: number, data: Partial<ArabLandmark>): Promise<ArabLandmark> => {
  const response = await axios.put(`${API_BASE}/admin/arab-world/landmarks/${id}`, data, getAdminHeaders());
  return response.data.landmark;
};

export const deleteArabLandmark = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/admin/arab-world/landmarks/${id}`, getAdminHeaders());
};

// Fetch hotels by Arab Country ID
export const getArabCountryHotels = async (arabCountryId: number | string): Promise<any[]> => {
  const response = await axios.get(`${API_BASE}/hotels`, { params: { arab_country_id: arabCountryId } });
  return response.data;
};

// Fetch restaurants by Arab Country ID
export const getArabCountryRestaurants = async (arabCountryId: number | string): Promise<any[]> => {
  const response = await axios.get(`${API_BASE}/restaurants`, { params: { arab_country_id: arabCountryId } });
  return response.data;
};
