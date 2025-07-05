import { computed } from "vue";
import { useRouterStore } from "@/store/routerStore";

export function useRouter() {
  const routerStore = useRouterStore();

  // Load routes not yet registered in DB
  const fetchAvailableRoutes = async () => {
    try {
      await routerStore.loadAvailableRoutes();
    } catch (error) {
      console.error("Failed to fetch available routes:", error);
    }
  };

  return {
    fetchAvailableRoutes,
    availableRoutes: computed(() => routerStore.availableRoutes),
    loading: computed(() => routerStore.loading),
    error: computed(() => routerStore.error),
  };
}
