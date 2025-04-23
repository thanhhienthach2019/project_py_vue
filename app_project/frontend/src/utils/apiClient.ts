import axios from "axios";
import { showToast } from "@/utils/toastUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
    },
});
// 🛡️ Interceptor  
apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          await axios.post(`${API_BASE_URL}/auth/refresh-token`, null, {
            withCredentials: true,
          });
  
          return apiClient(originalRequest);
        } catch (refreshError) {
        //   console.log(refreshError)
          window.localStorage.removeItem("user"); 
          window.location.href = "/login";
          return Promise.reject("Đã có lỗi xảy ra!");
        }
      }
      if (error.response?.status === 429) {
        showToast("Vui lòng thử lại sau vài phút!", "error");
      }
    //   console.log(error);
      return Promise.reject();
    }
  );
  
export default apiClient;
