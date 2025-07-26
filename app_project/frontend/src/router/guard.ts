// src/router/guard.ts
import router from "./index";
import { useAuthStore } from "@/store/auth/authStore";
// import { showToast } from "@/utils/toastUtils";

export function setupRouterGuard() {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    if (!to.meta.requiresAuth) return true;

    // if (!authStore.isFetched) {
    //   try {
    //     const ok = await authStore.checkOrRefreshSession(); 
    //     if (!ok) return "/";
    //     await authStore.fetchUser();
    //   } catch {
    //     return '/'; 
    //   }
    // }

    if (!authStore.isAuthenticated) return '/';

    // if (to.path === '/login' && authStore.isAuthenticated) {
    //   return '/admin';
    // }

    const requiredPerm = to.meta.permission as string | undefined;
    if (requiredPerm && !authStore.permissions.includes(requiredPerm)) {
      // showToast('You do not have permission to access this feature.', 'error');
      return '/admin/403';
    }

    return true;
  });
}
