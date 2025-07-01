import { useAuthStore } from "@/store/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export const authGuard = async (
  _to: RouteLocationNormalized, 
  _from: RouteLocationNormalized, 
  next: NavigationGuardNext) => {

  const authStore = useAuthStore();

   if (!authStore.isAuthenticated && !authStore.loading) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error("🔐 Lỗi xác thực");
    }
  }
  
  if (authStore.isAuthenticated) {
    next(); // 
  } else {
    console.warn("⛔ Không có quyền truy cập. Đang chuyển hướng về trang đăng nhập.");
    next("/login"); // 
  }
};
