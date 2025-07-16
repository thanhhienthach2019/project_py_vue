import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type { MenuItemCreate, MenuItemUpdate, MenuItemResponse } from "@/models/settings/menu";

// 🔹 Get all menu items (no filtering by user permission)
export const fetchAllMenus = async (): Promise<{
  success: boolean;
  data?: MenuItemResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/menus/all", getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched all menu items successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch all menu items",
    };
  }
};

// 🔹 Get menu tree for current user (filtered by permission)
export const fetchUserMenus = async (): Promise<{
  success: boolean;
  data?: MenuItemResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/menus", getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched user menu tree successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch user menus",
    };
  }
};

// 🔹 Create new menu item
export const createMenu = async (
  data: MenuItemCreate
): Promise<{
  success: boolean;
  message: string;
  data?: MenuItemResponse;
}> => {
  try {
    const response = await apiClient.post("/menus", data, getAuthHeaders());
    return {
      success: true,
      message: "Menu item created successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create menu item",
    };
  }
};

// 🔹 Update menu item by ID
export const updateMenu = async (
  menuId: number,
  data: MenuItemUpdate
): Promise<{
  success: boolean;
  message: string;
  data?: MenuItemResponse;
}> => {
  try {
    const response = await apiClient.put(`/menus/${menuId}`, data, getAuthHeaders());
    return {
      success: true,
      message: "Menu item updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update menu item",
    };
  }
};

// 🔹 Delete menu item by ID
export const deleteMenu = async (
  menuId: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await apiClient.delete(`/menus/${menuId}`, getAuthHeaders());
    return {
      success: true,
      message: "Menu item deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete menu item",
    };
  }
};
