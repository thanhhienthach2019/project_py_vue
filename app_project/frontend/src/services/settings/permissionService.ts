// src/services/permission.ts
import { apiClient } from "@/utils/apiClient";

export const fetchMyPermissions = async (): Promise<string[]> => {
  const response = await apiClient.get("/permissions/me");
  return response.data.permissions;
};
