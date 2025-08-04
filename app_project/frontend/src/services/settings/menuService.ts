import { apiClient } from "@/utils/apiClient";
import type { MenuItemCreate, MenuItemUpdate, MenuItemResponse } from "@/models/settings/menu";
import type { GenericResponse } from "@/types/api";

// 🔹 Get all menu items (admin only)
export const fetchAllMenus = async (): Promise<GenericResponse<MenuItemResponse[]>> => {
  try {
    const response = await apiClient.get("/menus/all");
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    const detail = error?.response?.data?.detail;

    return {
      success: false,
      data: undefined,
      message: detail?.message || "error.unknown",   
      args: detail?.args || {},
    };
  }
};

// 🔹 Get menu tree for current user (filtered by permission)
export const fetchUserMenus = async (): Promise<GenericResponse<MenuItemResponse[]>> => {
  try {
    const response = await apiClient.get("/menus");
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    const detail = error?.response?.data?.detail;
    console.log(detail)
    return {
      success: false,
      data: undefined,
      message: detail?.message || "error.unknown",   
      args: detail?.args || {},
    };
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
    const detail = error?.response?.data?.detail;

    return {
      success: false,
      data: undefined,
      message: detail?.message || "error.unknown",   
      args: detail?.args || {},
    };
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
    const detail = error?.response?.data?.detail;

    return {
      success: false,
      data: undefined,
      message: detail?.message || "error.unknown",   
      args: detail?.args || {},
    };
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
    return {
      success: false,
      message: error?.response?.data?.detail || "error.menu.delete_failed",
    };
  }
};
