import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  RouterCreate,
  RouterUpdate,
  RouterResponse,
  PermissionCreate,
  PermissionUpdate,
  PermissionResponse,
  RouterPermissionCreate,
  RouterPermissionUpdate,
  RouterPermissionResponse,
  RouterPermissionWithDetails 
} from "@/models/permissionRouter";

// ✅ Handle API error uniformly
const handleError = (error: any, fallback: string) => ({
  success: false,
  message: error.response?.data?.detail || fallback,
});

// ========= ROUTERS =========

export const fetchRouters = async (): Promise<{
  success: boolean;
  data?: RouterResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/routers", getAuthHeaders());
    return { success: true, data: response.data, message: "Fetched routers successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to fetch routers");
  }
};

export const createRouter = async (
  data: RouterCreate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.post("/router-permissions/routers", data, getAuthHeaders());
    return { success: true, message: "Router created successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to create router");
  }
};

export const updateRouter = async (
  routerId: number,
  data: RouterUpdate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.put(`/router-permissions/routers/${routerId}`, data, getAuthHeaders());
    return { success: true, message: "Router updated successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to update router");
  }
};

export const deleteRouter = async (
  routerId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`/router-permissions/routers/${routerId}`, getAuthHeaders());
    return { success: true, message: "Router deleted successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to delete router");
  }
};

// ========= PERMISSIONS =========

export const fetchPermissions = async (): Promise<{
  success: boolean;
  data?: PermissionResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/permissions", getAuthHeaders());
    return { success: true, data: response.data, message: "Fetched permissions successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to fetch permissions");
  }
};

export const createPermission = async (
  data: PermissionCreate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.post("/router-permissions/permissions", data, getAuthHeaders());
    return { success: true, message: "Permission created successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to create permission");
  }
};

export const updatePermission = async (
  permissionId: number,
  data: PermissionUpdate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.put(`/router-permissions/permissions/${permissionId}`, data, getAuthHeaders());
    return { success: true, message: "Permission updated successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to update permission");
  }
};

export const deletePermission = async (
  permissionId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`/router-permissions/permissions/${permissionId}`, getAuthHeaders());
    return { success: true, message: "Permission deleted successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to delete permission");
  }
};

// ========= ROUTER-PERMISSION BINDING =========

export const fetchRouterPermissions = async (): Promise<{
  success: boolean;
  data?: RouterPermissionResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings", getAuthHeaders());
    return { success: true, data: response.data, message: "Fetched bindings successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to fetch bindings");
  }
};

export const fetchRouterPermissionsWithDetails = async (): Promise<{
  success: boolean;
  data?: RouterPermissionWithDetails[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings/details", getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched detailed bindings successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to fetch router-permission with details");
  }
};

export const createRouterPermission = async (
  data: RouterPermissionCreate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.post("/router-permissions/bindings", data, getAuthHeaders());
    return { success: true, message: "Binding created successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to create binding");
  }
};

export const updateRouterPermission = async (
  id: number,
  data: RouterPermissionUpdate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.put(`/router-permissions/bindings/${id}`, data, getAuthHeaders());
    return { success: true, message: "Binding updated successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to update binding");
  }
};

export const deleteRouterPermission = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`/router-permissions/bindings/${id}`, getAuthHeaders());
    return { success: true, message: "Binding deleted successfully" };
  } catch (error: any) {
    return handleError(error, "Failed to delete binding");
  }
};
