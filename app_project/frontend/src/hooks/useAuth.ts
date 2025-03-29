import { computed } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async (username: string, password: string) => {
        try {
          const success = await authStore.login(username, password);
          if (success) router.push("/");
        } catch (error: any) {
          throw new Error(error.message || "Đăng nhập thất bại");
        }
      };
    const fetchUser = async () => {
      return await authStore.fetchUser();
    };

    const logout = () => {
        authStore.logout();
        router.push("/login");
    };

    return {
        login,
        logout,
        fetchUser,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        user: computed(() => authStore.user)
    };
}