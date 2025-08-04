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
  menus: MenuItemResponse[]

  isLoadingMenus: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

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
    isLoading(state): boolean {
      return (
        state.isLoadingMenus ||
        state.isCreating ||
        state.isUpdating ||
        state.isDeleting
      )
    },

    getMenuById: (state) => (id: number) => {
      return state.menus.find((menu) => menu.id === id)
    },
  },

  actions: {
    async loadMenus() {
      this.isLoadingMenus = true
      try {
        const response = await fetchAllMenus()
        if (!response.success) {
          return {
            success: false,
            message: response.message,
            args: response.args,
          };
        }
        if (response.success && response.data) {
          this.menus = response.data 
        }
        return response
      } finally {
        this.isLoadingMenus = false
      }
    },

    async createMenu(data: MenuItemCreate) {
      this.isCreating = true
      try {
        const response = await createMenu(data)
        if (!response.success) {
          return {
            success: false,
            message: response.message,
            args: response.args,
          };
        }
        return {
          success: true,
          message: response.message,
          args: response.args,
          data: response.data,
        }
      } catch (err: any) {
        return {
          success: false,
          message: err?.message ?? "error.unknown",
          args: err?.args ?? {},
        };
      } finally {
        this.isCreating = false
      }
    },

    async updateMenu(id: number, data: MenuItemUpdate) {
      this.isUpdating = true
      this.updatingId = id
      try {
        const response = await updateMenu(id, data)
        if (!response.success) {
          return {
            success: false,
            message: response.message,
            args: response.args,
          };
        }
        return {
          success: true,
          message: response.message,
          args: response.args,
          data: response.data,
        }
      } catch (err: any) {
        return {
          success: false,
          message: err?.message ?? "error.unknown",
          args: err?.args ?? {},
        };
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async deleteMenu(id: number) {
      this.isDeleting = true
      this.deletingId = id
      try {
        const response = await deleteMenu(id)
        if (!response.success) throw new Error(response.message)
        return {
          success: true,
          message: response.message,
          args: response.args,
        }
      } catch (err: any) {
        return {
          success: false,
          message: err.message,
          args: err.args ?? {},
        }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
