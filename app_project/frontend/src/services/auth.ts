// src/services/auth.ts
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; //Cho phép gửi cookie trong request

export const loginApi = async (username: string, password: string) => {
  return await axios.post(`${API_BASE_URL}/token`, 
    new URLSearchParams({ 
      username: username, 
      password: password 
    }).toString(), 
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
};

export const checkAuth = async () => {
  return await axios.get(`${API_BASE_URL}/check-auth`);
}

export const logoutApi = async () => {
  return await axios.post(`${API_BASE_URL}/logout`);
}
