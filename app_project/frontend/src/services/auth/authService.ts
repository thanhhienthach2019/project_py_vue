// src/services/auth.ts
import axios from "axios";
import { apiClient, refreshClient } from "@/utils/apiClient";
axios.defaults.withCredentials = true; 

export const loginApi = async (username: string, password: string) => {
  const data = {
    username: username,
    password: password,
  };

  return await apiClient.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json", 
    },
  });
};

export const checkAuth = async () => {
  return await apiClient.get("/auth/check-auth");
};

export const logoutApi = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } finally {
    // Clear cookies phía client
    document.cookie = '_aid-atk_=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_rid-rtk_=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export const refreshTokenApi = async () => {
  // Sử dụng refreshClient để tránh interceptor loop
  const response = await refreshClient.post('/auth/refresh-token');
  return response.data;
};