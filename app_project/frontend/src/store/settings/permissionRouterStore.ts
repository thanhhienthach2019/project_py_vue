import { defineStore } from "pinia";
import {  withLoadingToast } from "@/utils/piniaHelpers";
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
} from "@/services/settings/permissionRouterService";

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
} from "@/models/settings/permissionRouter";

interface PermissionRouterState {
  // Data collections
  routers: RouterResponse[];
  permissions: PermissionResponse[];
  bindings: RouterPermissionResponse[];
  detailedBindings: RouterPermissionWithDetails[];

  // Loading states
  isLoadingRouters: boolean;
  isLoadingPermissions: boolean;
  isLoadingBindings: boolean;
  isLoadingDetailedBindings: boolean;

  // Action states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // IDs for current operations
  updatingId: number | null;
  deletingId: number | null;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const usePermissionRouterStore = defineStore("permissionRouter", {
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
    /**
     * Checks if any major data collection is currently loading
     */
    isLoading(): boolean {
      return (
        this.isLoadingRouters ||
        this.isLoadingPermissions ||
        this.isLoadingBindings ||
        this.isLoadingDetailedBindings
      );
    },

    /**
     * Gets router by ID
     */
    getRouterById: (state) => (id: number) => {
      return state.routers.find((router) => router.id === id);
    },

    /**
     * Gets permission by ID
     */
    getPermissionById: (state) => (id: number) => {
      return state.permissions.find((permission) => permission.id === id);
    },
  },

  actions: {
    // ========================
    // 🚀 DATA LOADING ACTIONS
    // ========================

    /**
     * Load all routers from API
     */
    async loadRouters() {
      await withLoadingToast(
        this,
        "isLoadingRouters",
        async () => {
          await delay(1000);
          const response = await fetchRouters();
          if (response.success && response.data) {
            this.routers = response.data;
          }
          return response;
        },
        {
          loadingMsg: "Loading routers...",
          successMsg: "Routers loaded successfully",
          errorMsg: "Failed to load routers",
        }
      );
    },

    /**
     * Load all permissions from API
     */
    async loadPermissions() {
      await withLoadingToast(
        this,
        "isLoadingPermissions",
        async () => {
          await delay(1000);
          const response = await fetchPermissions();
          if (response.success && response.data) {
            this.permissions = response.data;
          }
          return response;
        },
        {
          loadingMsg: "Loading permissions...",
          successMsg: "Permissions loaded successfully",
          errorMsg: "Failed to load permissions",
        }
      );
    },

    /**
     * Load all router-permission bindings from API
     */
    async loadBindings() {
      await withLoadingToast(
        this,
        "isLoadingBindings",
        async () => {
          await delay(1000);
          const response = await fetchRouterPermissions();
          if (response.success && response.data) {
            this.bindings = response.data;
          }
          return response;
        },
        {
          loadingMsg: "Loading bindings...",
          successMsg: "Bindings loaded successfully",
          errorMsg: "Failed to load bindings",
        }
      );
    },

    /**
     * Load detailed router-permission bindings from API
     */
    async loadDetailedBindings() {
      await withLoadingToast(
        this,
        "isLoadingDetailedBindings",
        async () => {
          const response = await fetchRouterPermissionsWithDetails();
          if (response.success && response.data) {
            this.detailedBindings = response.data;
          }
          return response;
        },
        {
          loadingMsg: "Loading detailed bindings...",
          successMsg: "Detailed bindings loaded",
          errorMsg: "Failed to load detailed bindings",
        }
      );
    },

    // ========================
    // 🛠️ ROUTER ACTIONS
    // ========================

    /**
     * Create a new router
     */
    async createRouter(data: RouterCreate) {
      const tempId = -Date.now(); // Temporary ID for optimistic update
      const optimisticRouter: RouterResponse = { ...data, id: tempId };
      
      this.routers.push(optimisticRouter);
      this.isCreating = true;

      try {
        const response = await createRouter(data);
        
        if (response.success && response.data) {
          const index = this.routers.findIndex((r) => r.id === tempId);
          if (index !== -1) {
            this.routers.splice(index, 1, response.data);
          }
          return {
            success: true,
            message: "Router created successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to create router");
      } catch (error: any) {
        this.routers = this.routers.filter((r) => r.id !== tempId);
        return {
          success: false,
          message: error.message || "Failed to create router",
        };
      } finally {
        this.isCreating = false;
      }
    },

    /**
     * Update existing router
     */
    async updateRouter(id: number, data: RouterUpdate) {
      const index = this.routers.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, message: "Router not found" };
      }

      const backup = { ...this.routers[index] };
      this.routers[index] = { ...backup, ...data };
      this.isUpdating = true;
      this.updatingId = id;

      try {
        const response = await updateRouter(id, data);
        
        if (response.success && response.data) {
          this.routers[index] = response.data;
          return {
            success: true,
            message: "Router updated successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to update router");
      } catch (error: any) {
        this.routers[index] = backup;
        return {
          success: false,
          message: error.message || "Failed to update router",
        };
      } finally {
        this.isUpdating = false;
        this.updatingId = null;
      }
    },

    /**
     * Delete a router
     */
    async deleteRouter(id: number) {
      const backup = [...this.routers];
      this.routers = this.routers.filter((r) => r.id !== id);
      this.isDeleting = true;
      this.deletingId = id;

      try {
        const response = await deleteRouter(id);
        
        if (response.success) {
          return {
            success: true,
            message: "Router deleted successfully",
          };
        }
        throw new Error(response.message || "Failed to delete router");
      } catch (error: any) {
        this.routers = backup;
        return {
          success: false,
          message: error.message || "Failed to delete router",
        };
      } finally {
        this.isDeleting = false;
        this.deletingId = null;
      }
    },

    // ========================
    // 🔐 PERMISSION ACTIONS
    // ========================

    /**
     * Create a new permission
     */
    async createPermission(data: PermissionCreate) {
      const tempId = -Date.now();
      const optimisticPermission: PermissionResponse = { ...data, id: tempId };
      
      this.permissions.push(optimisticPermission);
      this.isCreating = true;

      try {
        const response = await createPermission(data);
        
        if (response.success && response.data) {
          const index = this.permissions.findIndex((p) => p.id === tempId);
          if (index !== -1) {
            this.permissions.splice(index, 1, response.data);
          }
          return {
            success: true,
            message: "Permission created successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to create permission");
      } catch (error: any) {
        this.permissions = this.permissions.filter((p) => p.id !== tempId);
        return {
          success: false,
          message: error.message || "Failed to create permission",
        };
      } finally {
        this.isCreating = false;
      }
    },

    /**
     * Update existing permission
     */
    async updatePermission(id: number, data: PermissionUpdate) {
      const index = this.permissions.findIndex((p) => p.id === id);
      if (index === -1) {
        return { success: false, message: "Permission not found" };
      }

      const backup = { ...this.permissions[index] };
      this.permissions[index] = { ...backup, ...data };
      this.isUpdating = true;
      this.updatingId = id;

      try {
        const response = await updatePermission(id, data);
        
        if (response.success && response.data) {
          this.permissions[index] = response.data;
          return {
            success: true,
            message: "Permission updated successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to update permission");
      } catch (error: any) {
        this.permissions[index] = backup;
        return {
          success: false,
          message: error.message || "Failed to update permission",
        };
      } finally {
        this.isUpdating = false;
        this.updatingId = null;
      }
    },

    /**
     * Delete a permission
     */
    async deletePermission(id: number) {
      const backup = [...this.permissions];
      this.permissions = this.permissions.filter((p) => p.id !== id);
      this.isDeleting = true;
      this.deletingId = id;

      try {
        const response = await deletePermission(id);
        
        if (response.success) {
          return {
            success: true,
            message: "Permission deleted successfully",
          };
        }
        throw new Error(response.message || "Failed to delete permission");
      } catch (error: any) {
        this.permissions = backup;
        return {
          success: false,
          message: error.message || "Failed to delete permission",
        };
      } finally {
        this.isDeleting = false;
        this.deletingId = null;
      }
    },

    // ========================
    // 🔗 BINDING ACTIONS
    // ========================

    /**
     * Create a new router-permission binding
     */
    async createBinding(data: RouterPermissionCreate) {
      const tempId = -Date.now();
      const optimisticBinding: RouterPermissionResponse = { ...data, id: tempId };
      
      this.bindings.push(optimisticBinding);
      this.isCreating = true;

      try {
        const response = await createRouterPermission(data);
        
        if (response.success && response.data) {
          const index = this.bindings.findIndex((b) => b.id === tempId);
          if (index !== -1) {
            this.bindings.splice(index, 1, response.data);
          }
          return {
            success: true,
            message: "Binding created successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to create binding");
      } catch (error: any) {
        this.bindings = this.bindings.filter((b) => b.id !== tempId);
        return {
          success: false,
          message: error.message || "Failed to create binding",
        };
      } finally {
        this.isCreating = false;
      }
    },

    /**
     * Update existing binding
     */
    async updateBinding(id: number, data: RouterPermissionUpdate) {
      const index = this.bindings.findIndex((b) => b.id === id);
      if (index === -1) {
        return { success: false, message: "Binding not found" };
      }

      const backup = { ...this.bindings[index] };
      this.bindings[index] = { ...backup, ...data };
      this.isUpdating = true;
      this.updatingId = id;

      try {
        const response = await updateRouterPermission(id, data);
        
        if (response.success && response.data) {
          this.bindings[index] = response.data;
          return {
            success: true,
            message: "Binding updated successfully",
            data: response.data,
          };
        }
        throw new Error(response.message || "Failed to update binding");
      } catch (error: any) {
        this.bindings[index] = backup;
        return {
          success: false,
          message: error.message || "Failed to update binding",
        };
      } finally {
        this.isUpdating = false;
        this.updatingId = null;
      }
    },

    /**
     * Delete a binding
     */
    async deleteBinding(id: number) {
      const backup = [...this.bindings];
      this.bindings = this.bindings.filter((b) => b.id !== id);
      this.isDeleting = true;
      this.deletingId = id;

      try {
        const response = await deleteRouterPermission(id);
        
        if (response.success) {
          return {
            success: true,
            message: "Binding deleted successfully",
          };
        }
        throw new Error(response.message || "Failed to delete binding");
      } catch (error: any) {
        this.bindings = backup;
        return {
          success: false,
          message: error.message || "Failed to delete binding",
        };
      } finally {
        this.isDeleting = false;
        this.deletingId = null;
      }
    },
  },
});