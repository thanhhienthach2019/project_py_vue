// src/hooks/useMenu.ts
import { computed } from 'vue'
import { useMenuStore } from '@/store/settings/menuStore'
import { registerStateStatusStore } from '@/composables/stateStatusRegistry'
import type { MenuItemCreate, MenuItemUpdate } from '@/models/settings/menu'

export function useMenu() {
  const store = useMenuStore()
  registerStateStatusStore(store)

  // ============ State Getters ============
  const state = {
    allMenus: computed(() => store.menus),
    isLoading: computed(() => store.isLoading),
    isCreating: computed(() => store.isCreating),
    isUpdating: computed(() => store.isUpdating),
    isDeleting: computed(() => store.isDeleting),
    updatingId: computed(() => store.updatingId),
    deletingId: computed(() => store.deletingId),
  }

  // ============ Data Loading ============
  const loaders = {
    fetchMenus: async () => {
      try {
        await store.loadMenus()
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load menus' }
      }
    },
  }

  // ============ Menu Operations ============
  const actions = {
    createMenu: async (data: MenuItemCreate) => {
      try {
        return await store.createMenu(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to create menu' }
      }
    },
    updateMenu: async (id: number, data: MenuItemUpdate) => {
      try {
        return await store.updateMenu(id, data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to update menu' }
      }
    },
    deleteMenu: async (id: number) => {
      try {
        return await store.deleteMenu(id)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete menu' }
      }
    },
  }

  // ============ Helper Getters ============
  const getters = {
    getMenuById: (id: number) => store.getMenuById(id),
  }

  return {
    // State
    ...state,
    // Loaders
    ...loaders,
    // Actions
    ...actions,
    // Getters
    ...getters,
  }
}
