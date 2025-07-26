import axios from "axios";
import { useAuthStore } from "@/store/auth/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ 
  resolve: (value?: unknown) => void; 
  reject: (reason?: any) => void 
}> = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject();
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      
      if (originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject();
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch(() => Promise.reject());
          // .catch(err => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await authStore.refreshToken();
        
        processQueue(null);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        
        const status = (refreshError as any)?.response?.status;
        if (status === 401 || status === 400) {
          await authStore.logout();
        }
        
        return Promise.reject();//refreshError
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);