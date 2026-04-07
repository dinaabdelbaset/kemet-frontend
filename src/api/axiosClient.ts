import axios from "axios";

/**
 * السيرفر (Backend)ـ Laravel 
 */
const axiosClient = axios.create({
  baseURL: "https://dinaabdelbaset-kemet.hf.space/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
