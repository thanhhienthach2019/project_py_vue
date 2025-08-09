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
import { createWithToastAction } from "@/utils/withToastAction";

export function usePermissionRouter() {
  const store = usePermissionRouterStore();
  const withToastAction = createWithToastAction();
  

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
    fetchRouters: () => withToastAction(() => store.loadRouters()),
    fetchPermissions: () => withToastAction(() => store.loadPermissions()),
    fetchBindings: () => withToastAction(() => store.loadBindings()),
    fetchDetailedBindings: () => withToastAction(() => store.loadDetailedBindings())
  };

  // ============ Router Operations ============
   const routerActions = {
    createRouter: (data: RouterCreate) => withToastAction(() => store.createRouter(data)),
    updateRouter: (id: string, data: RouterUpdate) => withToastAction(() => store.updateRouter(id, data)),
    deleteRouter: (id: string) => withToastAction(() => store.deleteRouter(id))
  };

  // ============ Permission Operations ============
    const permissionActions = {
    createPermission: (data: PermissionCreate) => withToastAction(() => store.createPermission(data)),
    updatePermission: (id: string, data: PermissionUpdate) => withToastAction(() => store.updatePermission(id, data)),
    deletePermission: (id: string) => withToastAction(() => store.deletePermission(id))
  };

  // ============ Binding Operations ============
   const bindingActions = {
    createBinding: (data: RouterPermissionCreate) => withToastAction(() => store.createBinding(data)),
    updateBinding: (id: string, data: RouterPermissionUpdate) => withToastAction(() => store.updateBinding(id, data)),
    deleteBinding: (id: string) => withToastAction(() => store.deleteBinding(id))
  };

  // ============ Helper Getters ============
  const getters = {
    getRouterById: (id: string) => store.getRouterById(id),
    getPermissionById: (id: string) => store.getPermissionById(id)
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