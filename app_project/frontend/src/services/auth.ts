// src/services/auth.ts
import axios from "axios";
import apiClient from "@/utils/apiClient";
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
  return await apiClient.post("/auth/logout");
};

export const refreshTokenApi = async () => {
  return await apiClient.post("/auth/refresh-token");
};