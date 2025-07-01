import { defineStore } from "pinia";
import {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  approveMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest
} from "@/services/maintenanceService";

import type {
  MaintenanceRequestCreate,
  MaintenanceRequestResponse,
  MaintenanceRequestUpdate
} from "@/models/maintenance";

interface MaintenanceState {
  maintenanceRequests: MaintenanceRequestResponse[];
  selectedMaintenanceRequest: MaintenanceRequestResponse | null;
}

export const useMaintenanceStore = defineStore("maintenance", {
  state: (): MaintenanceState => ({
    maintenanceRequests: [],
    selectedMaintenanceRequest: null,
  }),

  actions: {
    async fetchMaintenanceRequests() {
      const response = await getAllMaintenanceRequests();
      if (response.success && response.data) {
        this.maintenanceRequests = response.data;
      } else {
        console.error("Failed to fetch maintenance requests:", response.message);
      }
    },

    async fetchMaintenanceRequestById(requestId: number) {
      const response = await getMaintenanceRequestById(requestId);
      if (response.success && response.data) {
        this.selectedMaintenanceRequest = response.data;
      } else {
        console.error(`Failed to fetch maintenance request #${requestId}:`, response.message);
      }
    },

    async addMaintenanceRequest(requestData: MaintenanceRequestCreate) {
      const response = await createMaintenanceRequest(requestData);
      if (response.success && response.data) {
        this.maintenanceRequests.push(response.data);
      } else {
        console.error("Failed to create maintenance request:", response.message);
      }
      return response;
    },

    async approveMaintenanceRequest(requestId: number) {
      const response = await approveMaintenanceRequest(requestId);
      if (response.success) {
        const index = this.maintenanceRequests.findIndex(
          (item) => item.RequestID === requestId
        );
        if (index !== -1) {
          this.maintenanceRequests[index].Status = "Approved";
        }
      } else {
        console.error(`Failed to approve maintenance request #${requestId}:`, response.message);
      }
      return response;
    },

    async updateMaintenanceRequest(requestId: number, updateData: MaintenanceRequestUpdate) {
      const response = await updateMaintenanceRequest(requestId, updateData);
      if (response.success && response.data) {
        const index = this.maintenanceRequests.findIndex(
          (r) => r.RequestID === requestId
        );
        if (index !== -1) {
          this.maintenanceRequests[index] = response.data;
        }
      } else {
        console.error(`Failed to update maintenance request #${requestId}:`, response.message);
      }
      return response;
    },

    async deleteMaintenanceRequest(requestId: number) {
      const response = await deleteMaintenanceRequest(requestId);
      if (response.success) {
        this.maintenanceRequests = this.maintenanceRequests.filter(
          (r) => r.RequestID !== requestId
        );
      } else {
        console.error(`Failed to delete maintenance request #${requestId}:`, response.message);
      }
      return response;
    }
  }
});
