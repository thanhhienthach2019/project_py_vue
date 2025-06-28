import { computed } from "vue";
import { useMenuStore } from "@/store/menu"
import type { MenuItemCreate, MenuItemUpdate } from "@/models/menu";

export function useMenu() {
  const menuStore = useMenuStore();

  // Fetch user-permission-based menu tree
  const fetchUserMenus = async () => {
    try {
      await menuStore.loadUserMenus();
    } catch (error) {
      console.error("Failed to fetch user menus:", error);
    }
  };

  // Fetch all menus (admin view)
  const fetchAllMenus = async () => {
    try {
      await menuStore.loadAllMenus();
    } catch (error) {
      console.error("Failed to fetch all menus:", error);
    }
  };

  // Create a new menu
  const addMenu = async (menu: MenuItemCreate) => {
    try {
      const response = await menuStore.addNewMenu(menu);
      return response;
    } catch (error) {
      console.error("Failed to add menu:", error);
      return { success: false, message: "An error occurred while adding the menu." };
    }
  };

  // Update an existing menu
  const updateMenu = async (menuId: number, updatedData: MenuItemUpdate) => {
    try {
      const response = await menuStore.updateExistingMenu(menuId, updatedData);
      return response;
    } catch (error) {
      console.error("Failed to update menu:", error);
      return { success: false, message: "An error occurred while updating the menu." };
    }
  };

  // Delete a menu by ID
  const removeMenu = async (menuId: number) => {
    try {
      const response = await menuStore.removeMenu(menuId);
      return response;
    } catch (error) {
      console.error("Failed to delete menu:", error);
      return { success: false, message: "An error occurred while deleting the menu." };
    }
  };

  return {
    fetchUserMenus,
    fetchAllMenus,
    addMenu,
    updateMenu,
    removeMenu,
    userMenus: computed(() => menuStore.userMenus),
    allMenus: computed(() => menuStore.allMenus),
    loading: computed(() => menuStore.loading),
  };
}
