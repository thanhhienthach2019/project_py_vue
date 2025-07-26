import { computed } from "vue";
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore";
import type {
  RouterCreate,
  RouterUpdate,
  PermissionCreate,
  PermissionUpdate,
  RouterPermissionCreate,
  RouterPermissionUpdate
} from "@/models/settings/permissionRouter";
import { registerStateStatusStore } from '@/composables/stateStatusRegistry'

export function usePermissionRouter() {
  const store = usePermissionRouterStore();
  registerStateStatusStore(store)

  // ============ State Getters ============
  const state = {
    routers: computed(() => store.routers),
    permissions: computed(() => store.permissions),
    bindings: computed(() => store.bindings),
    detailedBindings: computed(() => store.detailedBindings),
    isLoadingRouters: computed(() => store.isLoadingRouters),
    isLoadingPermissions: computed(() => store.isLoadingPermissions),
    isLoadingBindings: computed(() => store.isLoadingBindings),
    isLoadingDetailedBindings: computed(() => store.isLoadingDetailedBindings),
    isCreating: computed(() => store.isCreating),
    isUpdating: computed(() => store.isUpdating),
    isDeleting: computed(() => store.isDeleting),
    updatingId: computed(() => store.updatingId),
    deletingId: computed(() => store.deletingId)
  };

  // ============ Data Loading ============
  const loaders = {
    fetchRouters: async () => {
      try {
        await store.loadRouters();
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to load routers"
        };
      }
    },

    fetchPermissions: async () => {
      try {
        await store.loadPermissions();
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to load permissions"
        };
      }
    },

    fetchBindings: async () => {
      try {
        await store.loadBindings();
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to load bindings"
        };
      }
    },

    fetchDetailedBindings: async () => {
      try {
        await store.loadDetailedBindings();
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to load detailed bindings"
        };
      }
    }
  };

  // ============ Router Operations ============
  const routerActions = {
    createRouter: async (data: RouterCreate) => {
      try {
        return await store.createRouter(data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to create router"
        };
      }
    },

    updateRouter: async (id: number, data: RouterUpdate) => {
      try {
        return await store.updateRouter(id, data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to update router"
        };
      }
    },

    deleteRouter: async (id: number) => {
      try {
        return await store.deleteRouter(id);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to delete router"
        };
      }
    }
  };

  // ============ Permission Operations ============
  const permissionActions = {
    createPermission: async (data: PermissionCreate) => {
      try {
        return await store.createPermission(data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to create permission"
        };
      }
    },

    updatePermission: async (id: number, data: PermissionUpdate) => {
      try {
        return await store.updatePermission(id, data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to update permission"
        };
      }
    },

    deletePermission: async (id: number) => {
      try {
        return await store.deletePermission(id);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to delete permission"
        };
      }
    }
  };

  // ============ Binding Operations ============
  const bindingActions = {
    createBinding: async (data: RouterPermissionCreate) => {
      try {
        return await store.createBinding(data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to create binding"
        };
      }
    },

    updateBinding: async (id: number, data: RouterPermissionUpdate) => {
      try {
        return await store.updateBinding(id, data);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to update binding"
        };
      }
    },

    deleteBinding: async (id: number) => {
      try {
        return await store.deleteBinding(id);
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to delete binding"
        };
      }
    }
  };

  // ============ Helper Getters ============
  const getters = {
    getRouterById: (id: number) => store.getRouterById(id),
    getPermissionById: (id: number) => store.getPermissionById(id)
  };

  return {
    // State
    ...state,
    
    // Loaders
    ...loaders,
    
    // Actions
    ...routerActions,
    ...permissionActions,
    ...bindingActions,
    
    // Getters
    ...getters
  };
}