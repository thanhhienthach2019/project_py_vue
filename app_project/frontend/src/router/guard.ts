import router from "./index";
import { useAuthStore } from "@/store/authStore";

export function setupRouterGuard() {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isFetched) {
      try {
        await authStore.fetchUser();
      } catch (err) {

      }
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
      return next({ path: '/' })
    }

    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        return next('/login');
      }

      const requiredPerm = to.meta.permission as string | undefined;
      if (requiredPerm && !authStore.permissions.includes(requiredPerm)) {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'You do not have permission to access this feature.',
              type: 'error'
            }
          })
        );
        return next(false);
      }

      return next();
    }

    next();
  });
}
