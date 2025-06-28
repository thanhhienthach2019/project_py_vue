import { computed } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async (username: string, password: string) => {
      try {
        const success = await authStore.login(username, password);
        if (success) {
          router.push("/");
        }
      } catch (error: any) {
        throw new Error("Đăng nhập thất bại");
      }
    };
    const fetchUser = async () => {
      await authStore.fetchUser();    
      if (!authStore.isAuthenticated) {
        router.push("/login");
      }
    };

    const logout = () => {
      authStore.logout(); 
    };

    return {
      login,
      logout,
      fetchUser,
      isAuthenticated: computed(() => authStore.isAuthenticated),
      user: computed(() => authStore.user),
      loading: computed(() => authStore.loading),
      permissions: computed(() => authStore.permissions),
      hasPermission: (key: string, action: string) => 
        authStore.permissions.includes(`${key}:${action}`)
    };
}