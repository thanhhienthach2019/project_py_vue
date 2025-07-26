// 📁 src/services/routerService.ts

import { apiClient } from "@/utils/apiClient";
import type { AvailableRoute } from "@/models/settings/router";

export const fetchAvailableRoutes = async (): Promise<{
  success: boolean;
  data?: AvailableRoute[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/routers/available");
    return {
      success: true,
      data: response.data.available_routes,
      message: "Fetched available routes successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch available routes",
    };
  }
};
