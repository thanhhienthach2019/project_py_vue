import { defineStore } from "pinia";
import {
  fetchUserMenus,
  fetchAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "@/services/menuService";
import type {
  MenuItemResponse,
  MenuItemCreate,
  MenuItemUpdate,
} from "@/models/menu";

interface MenuState {
  userMenus: MenuItemResponse[];
  allMenus: MenuItemResponse[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => ({
    userMenus: [],
    allMenus: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
  }),

  actions: {
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
        console.error("Error loading user menus:", error);
      } finally {
        this.loading = false;
      }
    },

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
        console.error("Error loading all menus:", error);
      } finally {
        this.loading = false;
      }
    },

    async addNewMenu(menu: MenuItemCreate) {
      const tempId = -Date.now();
      const optimisticMenu: MenuItemResponse = {
        ...menu,
        id: tempId,
        children: [],
      };
      this.allMenus.push(optimisticMenu);
      this.creating = true;

      try {
        const response = await createMenu(menu);
        if (response.success && response.data) {
          const index = this.allMenus.findIndex((m) => m.id === tempId);
          if (index !== -1) {
            this.allMenus.splice(index, 1, response.data);
          }
          return {
            success: true,
            message: "Menu created successfully",
            data: response.data,
          };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        this.allMenus = this.allMenus.filter((m) => m.id !== tempId);
        console.error("Create menu failed:", error);
        return { success: false, message: "Failed to create menu." };
      } finally {
        this.creating = false;
      }
    },

    async updateExistingMenu(menuId: number, updatedData: MenuItemUpdate) {
      const index = this.allMenus.findIndex((m) => m.id === menuId);
      if (index === -1) {
        return { success: false, message: "Menu not found." };
      }

      const backup = { ...this.allMenus[index] };
      this.allMenus[index] = { ...backup, ...updatedData };
      this.updating = true;

      try {
        const response = await updateMenu(menuId, updatedData);
        if (response.success && response.data) {
          this.allMenus[index] = response.data;
          return {
            success: true,
            message: "Menu updated successfully",
            data: response.data,
          };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        this.allMenus[index] = backup;
        console.error("Update menu failed:", error);
        return { success: false, message: "Failed to update menu." };
      } finally {
        this.updating = false;
      }
    },

    async removeMenu(menuId: number) {
      const backup = [...this.allMenus];
      this.allMenus = this.allMenus.filter((m) => m.id !== menuId);
      this.deleting = true;

      try {
        const response = await deleteMenu(menuId);
        if (response.success) {
          return { success: true, message: "Menu deleted successfully" };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        this.allMenus = backup;
        console.error("Delete menu failed:", error);
        return { success: false, message: "Failed to delete menu." };
      } finally {
        this.deleting = false;
      }
    },
  },
});
