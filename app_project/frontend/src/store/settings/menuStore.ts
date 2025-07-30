// src/store/settings/menuStore.ts
import { defineStore } from 'pinia'
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
      return (
        state.isLoadingMenus ||
        state.isCreating ||
        state.isUpdating ||
        state.isDeleting
      )
    },

    /**
     * Gets menu item by ID
     */
    getMenuById: (state) => (id: number) => {
      return state.menus.find((menu) => menu.id === id)
    },
  },

  actions: {
    // ========================
    // 🚀 DATA LOADING
    // ========================

    async loadMenus() {
      this.isLoadingMenus = true
      try {
        // await new Promise(resolve => setTimeout(resolve, 3000))
        const response = await fetchAllMenus()
        if (response.success && response.data) {
          this.menus = response.data
        }
        return response 
      } finally {
        this.isLoadingMenus = false
      }
    },

    // ========================
    // ➕ CREATE
    // ========================

    async createMenu(data: MenuItemCreate) {
      this.isCreating = true

      try {
        const response = await createMenu(data)
        if (response.success && response.data) {
          return { success: true, message: 'Menu created', data: response.data }
        }
        throw new Error(response.message || 'Failed to create menu')
      } catch (err: any) {
        return { success: false, message: err.message }
      } finally {
        this.isCreating = false
      }
    },

    // ========================
    // ✏️ UPDATE
    // ========================

    async updateMenu(id: number, data: MenuItemUpdate) {
      this.isUpdating = true
      this.updatingId = id

      try {
        const response = await updateMenu(id, data)
        if (response.success && response.data) {
          return { success: true, message: 'Menu updated', data: response.data }
        }
        throw new Error(response.message || 'Failed to update menu')
      } catch (err: any) {
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
      this.menus = this.menus.filter((m) => m.id !== id)
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
