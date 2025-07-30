// src/store/settings/permissionRouterStore.ts
import { defineStore } from 'pinia'
import {
  fetchRouters,
  createRouter,
  updateRouter,
  deleteRouter,
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  fetchRouterPermissions,
  fetchRouterPermissionsWithDetails,
  createRouterPermission,
  updateRouterPermission,
  deleteRouterPermission,
} from '@/services/settings/permissionRouterService'

import type {
  RouterResponse,
  RouterCreate,
  RouterUpdate,
  PermissionResponse,
  PermissionCreate,
  PermissionUpdate,
  RouterPermissionResponse,
  RouterPermissionCreate,
  RouterPermissionUpdate,
  RouterPermissionWithDetails,
} from '@/models/settings/permissionRouter'

interface PermissionRouterState {
  routers: RouterResponse[]
  permissions: PermissionResponse[]
  bindings: RouterPermissionResponse[]
  detailedBindings: RouterPermissionWithDetails[]

  isLoadingRouters: boolean
  isLoadingPermissions: boolean
  isLoadingBindings: boolean
  isLoadingDetailedBindings: boolean

  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  updatingId: number | null
  deletingId: number | null
}

export const usePermissionRouterStore = defineStore('permissionRouter', {
  state: (): PermissionRouterState => ({
    routers: [],
    permissions: [],
    bindings: [],
    detailedBindings: [],

    isLoadingRouters: false,
    isLoadingPermissions: false,
    isLoadingBindings: false,
    isLoadingDetailedBindings: false,

    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    updatingId: null,
    deletingId: null,
  }),

  getters: {
    isLoading(state): boolean {
      return (
        state.isLoadingRouters ||
        state.isLoadingPermissions ||
        state.isLoadingBindings ||
        state.isLoadingDetailedBindings
      )
    },
    getRouterById: (state) => (id: number) =>
      state.routers.find((r) => r.id === id),
    getPermissionById: (state) => (id: number) =>
      state.permissions.find((p) => p.id === id),
  },

  actions: {
    // ========================
    // 🚀 DATA LOAD
    // ========================

    async loadRouters() {
      this.isLoadingRouters = true
      try {
        const res = await fetchRouters()
        if (res.success && res.data) this.routers = res.data
        return res
      } finally {
        this.isLoadingRouters = false
      }
    },

    async loadPermissions() {
      this.isLoadingPermissions = true
      try {
        const res = await fetchPermissions()
        if (res.success && res.data) this.permissions = res.data
        return res
      } finally {
        this.isLoadingPermissions = false
      }
    },

    async loadBindings() {
      this.isLoadingBindings = true
      try {
        const res = await fetchRouterPermissions()
        if (res.success && res.data) this.bindings = res.data
        return res
      } finally {
        this.isLoadingBindings = false
      }
    },

    async loadDetailedBindings() {
      this.isLoadingDetailedBindings = true
      try {
        const res = await fetchRouterPermissionsWithDetails()
        if (res.success && res.data) this.detailedBindings = res.data
        return res
      } finally {
        this.isLoadingDetailedBindings = false
      }
    },

    // ========================
    // ➕ CREATE
    // ========================

    async createRouter(data: RouterCreate) {
      const tempId = -Date.now()
      const optimistic = { ...data, id: tempId }
      this.routers.push(optimistic)
      this.isCreating = true

      try {
        const res = await createRouter(data)
        if (res.success && res.data) {
          const i = this.routers.findIndex((r) => r.id === tempId)
          if (i !== -1) this.routers.splice(i, 1, res.data)
          return { success: true, message: 'Router created', data: res.data }
        }
        throw new Error(res.message || 'Failed to create router')
      } catch (err: any) {
        this.routers = this.routers.filter((r) => r.id !== tempId)
        return { success: false, message: 'Failed to create router' }
      } finally {
        this.isCreating = false
      }
    },

    async createPermission(data: PermissionCreate) {
      const tempId = -Date.now()
      const optimistic = { ...data, id: tempId }
      this.permissions.push(optimistic)
      this.isCreating = true

      try {
        const res = await createPermission(data)
        if (res.success && res.data) {
          const i = this.permissions.findIndex((p) => p.id === tempId)
          if (i !== -1) this.permissions.splice(i, 1, res.data)
          return { success: true, message: 'Permission created', data: res.data }
        }
        throw new Error(res.message || 'Failed to create permission')
      } catch (err: any) {
        this.permissions = this.permissions.filter((p) => p.id !== tempId)
        return { success: false, message: 'Failed to create permission' }
      } finally {
        this.isCreating = false
      }
    },

    async createBinding(data: RouterPermissionCreate) {
      const tempId = -Date.now()
      const optimistic = { ...data, id: tempId }
      this.bindings.push(optimistic)
      this.isCreating = true

      try {
        const res = await createRouterPermission(data)
        if (res.success && res.data) {
          const i = this.bindings.findIndex((b) => b.id === tempId)
          if (i !== -1) this.bindings.splice(i, 1, res.data)
          return { success: true, message: 'Binding created', data: res.data }
        }
        throw new Error(res.message || 'Failed to create binding')
      } catch (err: any) {
        this.bindings = this.bindings.filter((b) => b.id !== tempId)
        return { success: false, message: 'Failed to create binding' }
      } finally {
        this.isCreating = false
      }
    },

    // ========================
    // ✏️ UPDATE
    // ========================

    async updateRouter(id: number, data: RouterUpdate) {
      const i = this.routers.findIndex((r) => r.id === id)
      if (i === -1) return { success: false, message: 'Router not found' }

      const backup = { ...this.routers[i] }
      this.routers[i] = { ...backup, ...data }
      this.isUpdating = true
      this.updatingId = id

      try {
        const res = await updateRouter(id, data)
        if (res.success && res.data) {
          this.routers[i] = res.data
          return { success: true, message: 'Router updated', data: res.data }
        }
        throw new Error(res.message || 'Failed to update router')
      } catch (err: any) {
        this.routers[i] = backup
        return { success: false, message: 'Failed to update router'}
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async updatePermission(id: number, data: PermissionUpdate) {
      const i = this.permissions.findIndex((p) => p.id === id)
      if (i === -1) return { success: false, message: 'Permission not found' }

      const backup = { ...this.permissions[i] }
      this.permissions[i] = { ...backup, ...data }
      this.isUpdating = true
      this.updatingId = id

      try {
        const res = await updatePermission(id, data)
        if (res.success && res.data) {
          this.permissions[i] = res.data
          return { success: true, message: 'Permission updated', data: res.data }
        }
        throw new Error(res.message || 'Failed to update permission')
      } catch (err: any) {
        this.permissions[i] = backup
        return { success: false, message: 'Failed to update permission' }
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async updateBinding(id: number, data: RouterPermissionUpdate) {
      const i = this.bindings.findIndex((b) => b.id === id)
      if (i === -1) return { success: false, message: 'Binding not found' }

      const backup = { ...this.bindings[i] }
      this.bindings[i] = { ...backup, ...data }
      this.isUpdating = true
      this.updatingId = id

      try {
        const res = await updateRouterPermission(id, data)
        if (res.success && res.data) {
          this.bindings[i] = res.data
          return { success: true, message: 'Binding updated', data: res.data }
        }
        throw new Error(res.message || 'Failed to update binding')
      } catch (err: any) {
        this.bindings[i] = backup
        return { success: false, message: 'Failed to update binding'}
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // ========================
    // 🗑️ DELETE
    // ========================

    async deleteRouter(id: number) {
      const backup = [...this.routers]
      this.routers = this.routers.filter((r) => r.id !== id)
      this.isDeleting = true
      this.deletingId = id

      try {
        const res = await deleteRouter(id)
        if (res.success) return { success: true, message: 'Router deleted' }
        throw new Error(res.message || 'Failed to delete router')
      } catch (err: any) {
        this.routers = backup
        return { success: false, message: 'Failed to delete router' }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },

    async deletePermission(id: number) {
      const backup = [...this.permissions]
      this.permissions = this.permissions.filter((p) => p.id !== id)
      this.isDeleting = true
      this.deletingId = id

      try {
        const res = await deletePermission(id)
        if (res.success) return { success: true, message: 'Permission deleted' }
        throw new Error(res.message || 'Failed to delete permission')
      } catch (err: any) {
        this.permissions = backup
        return { success: false, message: 'Failed to delete permission' }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },

    async deleteBinding(id: number) {
      const backup = [...this.bindings]
      this.bindings = this.bindings.filter((b) => b.id !== id)
      this.isDeleting = true
      this.deletingId = id

      try {
        const res = await deleteRouterPermission(id)
        if (res.success) return { success: true, message: 'Binding deleted' }
        throw new Error(res.message || 'Failed to delete binding')
      } catch (err: any) {
        this.bindings = backup
        return { success: false, message: 'Failed to delete binding' }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
