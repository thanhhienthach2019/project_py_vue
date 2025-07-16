// src/services/permission.ts
import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";

export const fetchMyPermissions = async (): Promise<string[]> => {
  const response = await apiClient.get("/permissions/me", getAuthHeaders());
  return response.data.permissions;
};
