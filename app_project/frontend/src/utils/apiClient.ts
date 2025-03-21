import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 🔥 Gửi cookie tự động
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
