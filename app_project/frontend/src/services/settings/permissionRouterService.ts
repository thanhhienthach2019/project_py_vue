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
import type { GenericResponse } from "@/types/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// ========= 🔹 ROUTERS =========

// Get all routers
export const fetchRouters = async (): Promise<GenericResponse<RouterResponse[]>> => {
  try {
    const response = await apiClient.get("/router-permissions/routers");
    return {
      success: true,
      data: response.data.data,
      // message: response.data.message,
      // args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Create new router
export const createRouter = async (
  data: RouterCreate
): Promise<GenericResponse<RouterResponse>> => {
  try {
    const response = await apiClient.post("/router-permissions/routers", data);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Update router by ID
export const updateRouter = async (
  routerId: number,
  data: RouterUpdate
): Promise<GenericResponse<RouterResponse>> => {
  try {
    const response = await apiClient.put(`/router-permissions/routers/${routerId}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Delete router by ID
export const deleteRouter = async (
  routerId: number
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete(`/router-permissions/routers/${routerId}`);
    return {
      success: true,
      data: null,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========= 🔹 PERMISSIONS =========

// Get all permissions
export const fetchPermissions = async (): Promise<GenericResponse<PermissionResponse[]>> => {
  try {
    const response = await apiClient.get("/router-permissions/permissions");
    return {
      success: true,
      data: response.data.data,
      // message: response.data.message,
      // args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Create new permission
export const createPermission = async (
  data: PermissionCreate
): Promise<GenericResponse<PermissionResponse>> => {
  try {
    const response = await apiClient.post("/router-permissions/permissions", data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Update permission by ID
export const updatePermission = async (
  permissionId: number,
  data: PermissionUpdate
): Promise<GenericResponse<PermissionResponse>> => {
  try {
    const response = await apiClient.put(`/router-permissions/permissions/${permissionId}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Delete permission by ID
export const deletePermission = async (
  permissionId: number
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete(`/router-permissions/permissions/${permissionId}`);
    return {
      success: true,
      data: null,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========= 🔹 ROUTER-PERMISSION BINDINGS =========

// Get all bindings
export const fetchRouterPermissions = async (): Promise<GenericResponse<RouterPermissionResponse[]>> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings");
    
    return {
      success: true,
      data: response.data.data,
      // message: response.data.message,
      // args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Get all bindings with router & permission details
export const fetchRouterPermissionsWithDetails = async (): Promise<GenericResponse<RouterPermissionWithDetails[]>> => {
  try {
    const response = await apiClient.get("/router-permissions/bindings/details");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Create new router-permission binding
export const createRouterPermission = async (
  data: RouterPermissionCreate
): Promise<GenericResponse<RouterPermissionResponse>> => {
  try {
    const response = await apiClient.post("/router-permissions/bindings", data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Update binding by ID
export const updateRouterPermission = async (
  id: number,
  data: RouterPermissionUpdate
): Promise<GenericResponse<RouterPermissionResponse>> => {
  try {
    const response = await apiClient.put(`/router-permissions/bindings/${id}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Delete binding by ID
export const deleteRouterPermission = async (
  id: number
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete(`/router-permissions/bindings/${id}`);
    return {
      success: true,
      data: null,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};
