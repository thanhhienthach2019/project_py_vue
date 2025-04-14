import router from "./index";
import { useAuthStore } from "@/store/auth";

export function setupRouterGuard() {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth) {
      if (!authStore.isFetched) {
        try {
          await authStore.fetchUser();
        } catch (err) {

        }
      }

      if (authStore.isAuthenticated) {
        next();
      } else {
        next("/login");
      }
    } else {
      next();
    }
  });
}
