import { apiClient } from "@/utils/apiClient";
import type { MenuItemCreate, MenuItemUpdate, MenuItemResponse } from "@/models/settings/menu";

// 🔹 Get all menu items (no filtering by user permission)
export const fetchAllMenus = async (): Promise<{
  success: boolean;
  data?: MenuItemResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/menus/all");
    return {
      success: true,
      data: response.data,
      message: "Fetched all menu items successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to fetch all menu items",
      // message: error.response?.data?.detail || "Failed to fetch all menu items",
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
    const response = await apiClient.get("/menus"); 
    return {
      success: true,
      data: response.data,
      message: "Fetched user menu tree successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to fetch user menus",
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
    const response = await apiClient.post("/menus", data);
    return {
      success: true,
      message: "Menu item created successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to create menu item",
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
    const response = await apiClient.put(`/menus/${menuId}`, data);
    return {
      success: true,
      message: "Menu item updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update menu item",
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
    await apiClient.delete(`/menus/${menuId}`);
    return {
      success: true,
      message: "Menu item deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to delete menu item",
    };
  }
};
