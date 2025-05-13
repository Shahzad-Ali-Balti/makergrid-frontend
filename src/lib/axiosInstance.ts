import axios from "axios";
import { getToken, setToken, clearToken } from "@/utils/token";

// Will be set by AuthContext
let logoutFn: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
  logoutFn = fn;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends HttpOnly cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ⛳ Request Interceptor: Attach the current access token
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ⛳ Response Interceptor: Handle refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["new-access-token"];
    if (newAccessToken) {
      setToken(newAccessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axiosInstance.post("/api/accounts/refresh/");
        const newAccessToken = res.data.access;

        setToken(newAccessToken);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearToken(); // Clear token storage
        if (logoutFn) logoutFn();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
