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
        const response = await fetchAllMenus();
        if (response.success && response.data) {
          this.menus = response.data;
        }
        return response;
      } finally {
        this.isLoadingMenus = false
      }
    },

    async createMenu(data: MenuItemCreate) {
      this.isCreating = true
      try {
        return await createMenu(data);
      } finally {
        this.isCreating = false
      }
    },

    async updateMenu(id: number, data: MenuItemUpdate) {
      this.isUpdating = true
      this.updatingId = id
      try {
        return await updateMenu(id, data);        
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async deleteMenu(id: number) {
      this.isDeleting = true
      this.deletingId = id
      try {
        return await deleteMenu(id);        
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
