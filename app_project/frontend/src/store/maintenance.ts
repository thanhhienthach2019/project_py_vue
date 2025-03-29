// src/stores/maintenance.ts

import { defineStore } from "pinia";
import {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  approveMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest 
} from "@/services/maintenance";
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
      try {
        // Ép kiểu response nếu cần, đảm bảo kiểu trả về đúng với định nghĩa của service.
        const response = (await getAllMaintenanceRequests()) as { success: boolean; data?: MaintenanceRequestResponse[]; message: string };
        if (response.success && response.data) {
          this.maintenanceRequests = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu bảo trì: ", error);
      }
    },

    async fetchMaintenanceRequestById(requestId: number) {
      try {
        const response = await getMaintenanceRequestById(requestId);
        if (response.success && response.data) {
          this.selectedMaintenanceRequest = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy phiếu bảo trì: ", error);
      }
    },

    async addMaintenanceRequest(requestData: MaintenanceRequestCreate) {
      try {
        const response = await createMaintenanceRequest(requestData);
        if (response.success && response.data) {
          // Thêm phiếu mới vào state
          this.maintenanceRequests.push(response.data);
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi tạo phiếu bảo trì:", error);
        throw error;
      }
    },

    async approveMaintenanceRequest(requestId: number) {
      try {
        const response = await approveMaintenanceRequest(requestId);
        if (response.success) {
          // Cập nhật trạng thái của phiếu trong state nếu có
          const index = this.maintenanceRequests.findIndex(
            (item) => item.RequestID === requestId
          );
          if (index !== -1 && this.maintenanceRequests[index]) {
            this.maintenanceRequests[index].Status = "Approved";
          }
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi duyệt phiếu bảo trì:", error);
        throw error;
      }
    },

    async updateMaintenanceRequest(requestId: number, updateData: MaintenanceRequestUpdate) {
      try {
        const response = await updateMaintenanceRequest(requestId, updateData);
        if (response.success && response.data) {
          const index = this.maintenanceRequests.findIndex(
            (r) => r.RequestID === requestId
          );
          if (index !== -1) {
            this.maintenanceRequests[index] = response.data;
          }
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi cập nhật phiếu bảo trì:", error);
        throw error;
      }
    },
    async deleteMaintenanceRequest(requestId: number) {
      try {
        const response = await deleteMaintenanceRequest(requestId);
        if (response.success) {
          this.maintenanceRequests = this.maintenanceRequests.filter(
            (r) => r.RequestID !== requestId
          );
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi xóa phiếu bảo trì:", error);
        throw error;
      }
    }
  }
});
