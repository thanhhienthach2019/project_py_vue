import { defineStore } from "pinia";
import { fetchAvailableRoutes } from "@/services/settings/routerService";
import type { AvailableRoute } from "@/models/settings/router";

interface RouterState {
  availableRoutes: AvailableRoute[];
  loading: boolean;
  error: string | null;
}

export const useRouterStore = defineStore("router", {
  state: (): RouterState => ({
    availableRoutes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadAvailableRoutes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchAvailableRoutes();
        if (response.success && response.data) {
          this.availableRoutes = response.data;
        } else {
          this.error = response.message;
          this.availableRoutes = [];
        }
      } catch (err) {
        console.error("Error loading available routes:", err);
        this.error = "Unexpected error while loading routes.";
      } finally {
        this.loading = false;
      }
    }
  }
});