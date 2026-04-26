import axios from "axios";

/**
 * السيرفر (Backend)ـ Laravel 
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosClient;

// Global GET Cache to prevent redundant "Loading..." states on navigation
const getCache = new Map();
const originalGet = axiosClient.get;

axiosClient.get = async (url: string, config?: any) => {
  const cacheKey = url + JSON.stringify(config || {});
  
  if (getCache.has(cacheKey)) {
    return Promise.resolve(getCache.get(cacheKey));
  }
  
  const response = await originalGet(url, config);
  getCache.set(cacheKey, response);
  
  // Clear cache for this URL after 2 minutes so fresh data can be loaded eventually
  setTimeout(() => getCache.delete(cacheKey), 2 * 60 * 1000);
  
  return response;
};
