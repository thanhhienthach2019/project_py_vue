import { apiClient } from "@/utils/apiClient";
import type { MenuItemCreate, MenuItemUpdate, MenuItemResponse } from "@/models/settings/menu";
import type { GenericResponse } from "@/types/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// 🔹 Get all menu items (admin only)
export const fetchAllMenus = async (): Promise<GenericResponse<MenuItemResponse[]>> => {
  try {
    const response = await apiClient.get("/menus/all");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// 🔹 Get menu tree for current user (filtered by permission)
export const fetchUserMenus = async (): Promise<GenericResponse<MenuItemResponse[]>> => {
  try {
    const response = await apiClient.get("/menus");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// 🔹 Create new menu item
export const createMenu = async (
  data: MenuItemCreate
): Promise<GenericResponse<MenuItemResponse>> => {
  try {
    const response = await apiClient.post("/menus", data);
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

// 🔹 Update menu item by ID
export const updateMenu = async (
  menuId: number,
  data: MenuItemUpdate
): Promise<GenericResponse<MenuItemResponse>> => {
  try {
    const response = await apiClient.put(`/menus/${menuId}`, data);
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

// 🔹 Delete menu item by ID
export const deleteMenu = async (menuId: number): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete(`/menus/${menuId}`);
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
