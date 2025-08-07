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
      this.isCreating = true;
      try {
        return await createRouter(data)        
      } finally {
        this.isCreating = false
      }
    },

    async createPermission(data: PermissionCreate) {
      this.isCreating = true
      try {
        return await createPermission(data);
      } finally {
        this.isCreating = false
      }
    },

    async createBinding(data: RouterPermissionCreate) {      
      this.isCreating = true;
      try {
        return await createRouterPermission(data);
      } finally {
        this.isCreating = false
      }
    },

    // ========================
    // ✏️ UPDATE
    // ========================

    async updateRouter(id: number, data: RouterUpdate) {      
      this.isUpdating = true
      this.updatingId = id
      try {
        return await updateRouter(id, data);        
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async updatePermission(id: number, data: PermissionUpdate) {      
      this.isUpdating = true
      this.updatingId = id
      try {
        return await updatePermission(id, data);
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    async updateBinding(id: number, data: RouterPermissionUpdate) {      
      this.isUpdating = true
      this.updatingId = id
      try {
        return await updateRouterPermission(id, data);        
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // ========================
    // 🗑️ DELETE
    // ========================

    async deleteRouter(id: number) {      
      this.isDeleting = true
      this.deletingId = id
      try {
        return await deleteRouter(id);        
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },

    async deletePermission(id: number) {      
      this.isDeleting = true
      this.deletingId = id
      try {
        return await deletePermission(id);        
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },

    async deleteBinding(id: number) {      
      this.isDeleting = true
      this.deletingId = id
      try {
        return await deleteRouterPermission(id);        
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
