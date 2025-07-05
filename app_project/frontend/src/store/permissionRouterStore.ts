import { defineStore } from "pinia";
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
  createRouterPermission,
  updateRouterPermission,
  deleteRouterPermission,
  fetchRouterPermissionsWithDetails
} from "@/services/permissionRouterService";

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
  RouterPermissionWithDetails
} from "@/models/permissionRouter";

interface PermissionRouterState {
  routers: RouterResponse[];
  permissions: PermissionResponse[];
  bindings: RouterPermissionResponse[];
  detailedBindings: RouterPermissionWithDetails[];
  loading: boolean;
}

export const usePermissionRouterStore = defineStore("permissionRouter", {
  state: (): PermissionRouterState => ({
    routers: [],
    permissions: [],
    bindings: [],
    detailedBindings: [] as RouterPermissionWithDetails[],
    loading: false
  }),

  actions: {
    // ========= Load =========
    async loadRouters() {
      this.loading = true;
      try {
        const res = await fetchRouters();
        if (res.success && res.data) {
          this.routers = res.data;
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Failed to load routers:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadPermissions() {
      this.loading = true;
      try {
        const res = await fetchPermissions();
        if (res.success && res.data) {
          this.permissions = res.data;
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Failed to load permissions:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadBindings() {
      this.loading = true;
      try {
        const res = await fetchRouterPermissions();
        if (res.success && res.data) {
          this.bindings = res.data;
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Failed to load bindings:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadDetailedBindings() {
      this.loading = true;
      try {
        const res = await fetchRouterPermissionsWithDetails();
        if (res.success && res.data) {
          this.detailedBindings = res.data ?? [];
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Failed to load detailed bindings:", error);
      } finally {
        this.loading = false;
      }
    },

    // ========= Router Actions =========
    async addRouter(data: RouterCreate) {
      try {
        const res = await createRouter(data);
        if (res.success) await this.loadRouters();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error creating router:", error);
        return { success: false, message: "Unexpected error when creating router." };
      }
    },

    async updateRouterById(routerId: number, data: RouterUpdate) {
      try {
        const res = await updateRouter(routerId, data);
        if (res.success) await this.loadRouters();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error updating router:", error);
        return { success: false, message: "Unexpected error when updating router." };
      }
    },

    async deleteRouterById(routerId: number) {
      try {
        const res = await deleteRouter(routerId);
        if (res.success) await this.loadRouters();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error deleting router:", error);
        return { success: false, message: "Unexpected error when deleting router." };
      }
    },

    // ========= Permission Actions =========
    async addPermission(data: PermissionCreate) {
      try {
        const res = await createPermission(data);
        if (res.success) await this.loadPermissions();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error creating permission:", error);
        return { success: false, message: "Unexpected error when creating permission." };
      }
    },

    async updatePermissionById(permissionId: number, data: PermissionUpdate) {
      try {
        const res = await updatePermission(permissionId, data);
        if (res.success) await this.loadPermissions();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error updating permission:", error);
        return { success: false, message: "Unexpected error when updating permission." };
      }
    },

    async deletePermissionById(permissionId: number) {
      try {
        const res = await deletePermission(permissionId);
        if (res.success) await this.loadPermissions();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error deleting permission:", error);
        return { success: false, message: "Unexpected error when deleting permission." };
      }
    },

    // ========= RouterPermission Binding Actions =========
    async addBinding(data: RouterPermissionCreate) {
      try {
        const res = await createRouterPermission(data);
        if (res.success) await this.loadBindings();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error creating binding:", error);
        return { success: false, message: "Unexpected error when creating binding." };
      }
    },

    async updateBinding(id: number, data: RouterPermissionUpdate) {
      try {
        const res = await updateRouterPermission(id, data);
        if (res.success) await this.loadBindings();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error updating binding:", error);
        return { success: false, message: "Unexpected error when updating binding." };
      }
    },

    async deleteBinding(id: number) {
      try {
        const res = await deleteRouterPermission(id);
        if (res.success) await this.loadBindings();
        else console.error(res.message);
        return res;
      } catch (error) {
        console.error("Error deleting binding:", error);
        return { success: false, message: "Unexpected error when deleting binding." };
      }
    }
  }
});
