import { apiClient } from "@/utils/apiClient";
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
} from "@/models/settings/permissionRouter";

// 🔧 Handle API error uniformly
const handleError = (error: any, fallback: string) => ({
  success: false,
  message: error.response?.data?.detail || fallback,
});

// ========= 🔹 ROUTERS =========

// Get all routers
export const fetchRouters = async (): Promise<{
  success: boolean;
  data?: RouterResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/routers");
    return {
      success: true,
      data: response.data,
      message: "Fetched routers successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to fetch routers");
  }
};

// Create new router
export const createRouter = async (
  data: RouterCreate
): Promise<{
  success: boolean;
  message: string;
  data?: RouterResponse;
}> => {
  try {
    const response = await apiClient.post("/router-permissions/routers", data);
    return {
      success: true,
      message: "Router created successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to create router");
  }
};

// Update router by ID
export const updateRouter = async (
  routerId: number,
  data: RouterUpdate
): Promise<{
  success: boolean;
  message: string;
  data?: RouterResponse;
}> => {
  try {
    const response = await apiClient.put(`/router-permissions/routers/${routerId}`, data);
    return {
      success: true,
      message: "Router updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to update router");
  }
};

// Delete router by ID
export const deleteRouter = async (
  routerId: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await apiClient.delete(`/router-permissions/routers/${routerId}`);
    return {
      success: true,
      message: "Router deleted successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to delete router");
  }
};

// ========= 🔹 PERMISSIONS =========

// Get all permissions
export const fetchPermissions = async (): Promise<{
  success: boolean;
  data?: PermissionResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/permissions");
    return {
      success: true,
      data: response.data,
      message: "Fetched permissions successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to fetch permissions");
  }
};

// Create new permission
export const createPermission = async (
  data: PermissionCreate
): Promise<{
  success: boolean;
  message: string;
  data?: PermissionResponse;
}> => {
  try {
    const response = await apiClient.post("/router-permissions/permissions", data);
    return {
      success: true,
      message: "Permission created successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to create permission");
  }
};

// Update permission by ID
export const updatePermission = async (
  permissionId: number,
  data: PermissionUpdate
): Promise<{
  success: boolean;
  message: string;
  data?: PermissionResponse;
}> => {
  try {
    const response = await apiClient.put(`/router-permissions/permissions/${permissionId}`, data);
    return {
      success: true,
      message: "Permission updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to update permission");
  }
};

// Delete permission by ID
export const deletePermission = async (
  permissionId: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await apiClient.delete(`/router-permissions/permissions/${permissionId}`);
    return {
      success: true,
      message: "Permission deleted successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to delete permission");
  }
};

// ========= 🔹 ROUTER-PERMISSION BINDINGS =========

// Get all bindings (simple)
export const fetchRouterPermissions = async (): Promise<{
  success: boolean;
  data?: RouterPermissionResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings");
    return {
      success: true,
      data: response.data,
      message: "Fetched bindings successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to fetch bindings");
  }
};

// Get all bindings with router & permission details
export const fetchRouterPermissionsWithDetails = async (): Promise<{
  success: boolean;
  data?: RouterPermissionWithDetails[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings/details");
    return {
      success: true,
      data: response.data,
      message: "Fetched detailed bindings successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to fetch router-permission with details");
  }
};

// Create new router-permission binding
export const createRouterPermission = async (
  data: RouterPermissionCreate
): Promise<{
  success: boolean;
  message: string;
  data?: RouterPermissionResponse;
}> => {
  try {
    const response = await apiClient.post("/router-permissions/bindings", data);
    return {
      success: true,
      message: "Binding created successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to create binding");
  }
};

// Update binding by ID
export const updateRouterPermission = async (
  id: number,
  data: RouterPermissionUpdate
): Promise<{
  success: boolean;
  message: string;
  data?: RouterPermissionResponse;
}> => {
  try {
    const response = await apiClient.put(`/router-permissions/bindings/${id}`, data);
    return {
      success: true,
      message: "Binding updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return handleError(error, "Failed to update binding");
  }
};

// Delete binding by ID
export const deleteRouterPermission = async (
  id: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await apiClient.delete(`/router-permissions/bindings/${id}`);
    return {
      success: true,
      message: "Binding deleted successfully",
    };
  } catch (error: any) {
    return handleError(error, "Failed to delete binding");
  }
};
