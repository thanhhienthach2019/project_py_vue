import { computed } from "vue";
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore"

import type {
  RouterCreate,
  RouterUpdate,
  PermissionCreate,
  PermissionUpdate,
  RouterPermissionCreate,
  RouterPermissionUpdate
} from "@/models/settings/permissionRouter";

export function usePermissionRouter() {
  const store = usePermissionRouterStore();

  // ========= Load methods =========
  const fetchRouters = async () => {
    try {
      await store.loadRouters();
    } catch (error) {
      console.error("Failed to fetch routers:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      await store.loadPermissions();
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchBindings = async () => {
    try {
      await store.loadBindings();
    } catch (error) {
      console.error("Failed to fetch bindings:", error);
    }
  };

  const fetchDetailedBindings = async () => {
    try {
      await store.loadDetailedBindings();
    } catch (error) {
      console.error("Failed to fetch detailed bindings:", error);
    }
  };

  // ========= Router methods =========
  const addRouter = async (router: RouterCreate) => {
    try {
      return await store.addRouter(router);
    } catch (error) {
      console.error("Failed to add router:", error);
      return { success: false, message: "An error occurred while adding router." };
    }
  };

  const updateRouter = async (id: number, data: RouterUpdate) => {
    try {
      return await store.updateRouterById(id, data);
    } catch (error) {
      console.error("Failed to update router:", error);
      return { success: false, message: "An error occurred while updating router." };
    }
  };

  const removeRouter = async (id: number) => {
    try {
      return await store.deleteRouterById(id);
    } catch (error) {
      console.error("Failed to delete router:", error);
      return { success: false, message: "An error occurred while deleting router." };
    }
  };

  // ========= Permission methods =========
  const addPermission = async (data: PermissionCreate) => {
    try {
      return await store.addPermission(data);
    } catch (error) {
      console.error("Failed to add permission:", error);
      return { success: false, message: "An error occurred while adding permission." };
    }
  };

  const updatePermission = async (id: number, data: PermissionUpdate) => {
    try {
      return await store.updatePermissionById(id, data);
    } catch (error) {
      console.error("Failed to update permission:", error);
      return { success: false, message: "An error occurred while updating permission." };
    }
  };

  const removePermission = async (id: number) => {
    try {
      return await store.deletePermissionById(id);
    } catch (error) {
      console.error("Failed to delete permission:", error);
      return { success: false, message: "An error occurred while deleting permission." };
    }
  };

  // ========= Binding methods =========
  const addBinding = async (data: RouterPermissionCreate) => {
    try {
      return await store.addBinding(data);
    } catch (error) {
      console.error("Failed to add binding:", error);
      return { success: false, message: "An error occurred while adding binding." };
    }
  };

  const updateBinding = async (id: number, data: RouterPermissionUpdate) => {
    try {
      return await store.updateBinding(id, data);
    } catch (error) {
      console.error("Failed to update binding:", error);
      return { success: false, message: "An error occurred while updating binding." };
    }
  };

  const removeBinding = async (id: number) => {
    try {
      return await store.deleteBinding(id);
    } catch (error) {
      console.error("Failed to delete binding:", error);
      return { success: false, message: "An error occurred while deleting binding." };
    }
  };

  return {
    // Loaders
    fetchRouters,
    fetchPermissions,
    fetchBindings,
    fetchDetailedBindings,

    // CRUD: Router
    addRouter,
    updateRouter,
    removeRouter,

    // CRUD: Permission
    addPermission,
    updatePermission,
    removePermission,

    // CRUD: Binding
    addBinding,
    updateBinding,
    removeBinding,

    // State
    routers: computed(() => store.routers),
    permissions: computed(() => store.permissions),
    bindings: computed(() => store.bindings),
    detailedBindings: computed(() => store.detailedBindings),
    loading: computed(() => store.loading),
  };
}
