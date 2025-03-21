import { useAuthStore } from "@/store/auth";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export const authGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    await authStore.fetchUser();
  }
  if (authStore.isAuthenticated) {
    next(); // ✅ Cho phép vào trang
  } else {
    console.warn("⛔ Không có quyền truy cập, chuyển hướng đến /login");
    next("/login"); // 🔄 Chuyển về trang đăng nhập
  }
};
