// src/store/settings/menuStore.ts
import { defineStore } from 'pinia'
import { withLoadingToast } from '@/utils/piniaHelpers'
import {
  fetchAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from '@/services/settings/menuService'

import type {
  MenuItemResponse,
  MenuItemCreate,
  MenuItemUpdate,
} from '@/models/settings/menu'

function toMenuItemResponse(
  item: MenuItemCreate,
  id: number
): MenuItemResponse {
  return {
    ...item,
    id,
    children: item.children?.map((child, index) =>
      toMenuItemResponse(child, id - index - 1) 
    ),
  }
}

interface MenuState {
  // Data
  menus: MenuItemResponse[]

  // Loading states
  isLoadingMenus: boolean

  // Action states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // IDs for current operations
  updatingId: number | null
  deletingId: number | null
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],

    isLoadingMenus: false,

    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    updatingId: null,
    deletingId: null,
  }),

  getters: {
    /**
     * Checks if any operation is loading
     */
    isLoading(state): boolean {
      return state.isLoadingMenus || state.isCreating || state.isUpdating || state.isDeleting
    },

    /**
     * Gets menu item by ID
     */
    getMenuById: (state) => (id: number) => {
      return state.menus.find(menu => menu.id === id)
    },
  },

  actions: {
    // ========================
    // 🚀 DATA LOADING
    // ========================

    async loadMenus() {
      await withLoadingToast(
        this,
        'isLoadingMenus',
        async () => {
          await delay(1000);
          const response = await fetchAllMenus()
          if (response.success && response.data) {
            this.menus = response.data
          }
          return response
        },
        {
          loadingMsg: 'Loading menus...',
          successMsg: 'Menus loaded successfully',
          errorMsg: 'Failed to load menus',
        }
      )
    },

    // ========================
    // ➕ CREATE
    // ========================

    async createMenu(data: MenuItemCreate) {
      const tempId = -Date.now()
      const optimistic = toMenuItemResponse(data, tempId)
      this.menus.push(optimistic)
      this.isCreating = true

      try {
        const response = await createMenu(data)
        if (response.success && response.data) {
          const idx = this.menus.findIndex(m => m.id === tempId)
          if (idx !== -1) this.menus.splice(idx, 1, response.data)
          return { success: true, message: 'Menu created', data: response.data }
        }
        throw new Error(response.message || 'Failed to create menu')
      } catch (err: any) {
        this.menus = this.menus.filter(m => m.id !== tempId)
        return { success: false, message: err.message }
      } finally {
        this.isCreating = false
      }
    },

    // ========================
    // ✏️ UPDATE
    // ========================

    async updateMenu(id: number, data: MenuItemUpdate) {
      const idx = this.menus.findIndex(m => m.id === id)
      if (idx === -1) return { success: false, message: 'Menu not found' }

      const backup = { ...this.menus[idx] }
      this.menus[idx] = { ...backup, ...data }
      this.isUpdating = true
      this.updatingId = id

      try {
        const response = await updateMenu(id, data)
        if (response.success && response.data) {
          this.menus[idx] = response.data
          return { success: true, message: 'Menu updated', data: response.data }
        }
        throw new Error(response.message || 'Failed to update menu')
      } catch (err: any) {
        this.menus[idx] = backup
        return { success: false, message: err.message }
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // ========================
    // 🗑️ DELETE
    // ========================

    async deleteMenu(id: number) {
      const backup = [...this.menus]
      this.menus = this.menus.filter(m => m.id !== id)
      this.isDeleting = true
      this.deletingId = id

      try {
        const response = await deleteMenu(id)
        if (response.success) {
          return { success: true, message: 'Menu deleted' }
        }
        throw new Error(response.message || 'Failed to delete menu')
      } catch (err: any) {
        this.menus = backup
        return { success: false, message: err.message }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
