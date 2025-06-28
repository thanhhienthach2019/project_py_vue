import { defineStore } from "pinia";
import {
  fetchUserMenus,
  fetchAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "@/services/menu";
import type { MenuItemResponse, MenuItemCreate, MenuItemUpdate } from "@/models/menu";

interface MenuState {
  userMenus: MenuItemResponse[];
  allMenus: MenuItemResponse[];
  loading: boolean;
}

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => ({
    userMenus: [],
    allMenus: [],
    loading: false,
  }),

  actions: {
    // Load menu tree filtered by current user's permissions
    async loadUserMenus() {
      this.loading = true;
      try {
        const response = await fetchUserMenus();
        if (response.success && response.data) {
          this.userMenus = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching user menus:", error);
      } finally {
        this.loading = false;
      }
    },

    // Load all menus from database
    async loadAllMenus() {
      this.loading = true;
      try {
        const response = await fetchAllMenus();
        if (response.success && response.data) {
          this.allMenus = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching all menus:", error);
      } finally {
        this.loading = false;
      }
    },

    // Create new menu item
    async addNewMenu(menu: MenuItemCreate) {
      try {
        const response = await createMenu(menu);
        if (response.success) {
          await this.loadAllMenus();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while creating menu:", error);
        return { success: false, message: "Unexpected error when creating menu." };
      }
    },

    // Update existing menu item
    async updateExistingMenu(menuId: number, updatedData: MenuItemUpdate) {
      try {
        const response = await updateMenu(menuId, updatedData);
        if (response.success) {
          await this.loadAllMenus();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while updating menu:", error);
        return { success: false, message: "Unexpected error when updating menu." };
      }
    },

    // Delete menu item
    async removeMenu(menuId: number) {
      try {
        const response = await deleteMenu(menuId);
        if (response.success) {
          await this.loadAllMenus();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while deleting menu:", error);
        return { success: false, message: "Unexpected error when deleting menu." };
      }
    }
  }
});
