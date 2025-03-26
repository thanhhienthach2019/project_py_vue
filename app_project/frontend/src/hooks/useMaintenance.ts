// src/hooks/useMaintenance.ts

import { computed } from "vue";
import { useMaintenanceStore } from "@/store/maintenance";
import type {
  MaintenanceRequestCreate,
  MaintenanceRequestUpdate
} from "@/models/maintenance";

export function useMaintenance() {
  const maintenanceStore = useMaintenanceStore();

  // Lấy danh sách phiếu bảo trì
  const fetchMaintenanceRequests = async () => {
    try {
      await maintenanceStore.fetchMaintenanceRequests();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu bảo trì:", error);
    }
  };

  // Lấy thông tin phiếu bảo trì theo ID
  const fetchMaintenanceRequestById = async (requestId: number) => {
    try {
      await maintenanceStore.fetchMaintenanceRequestById(requestId);
    } catch (error) {
      console.error("Lỗi khi lấy phiếu bảo trì theo ID:", error);
    }
  };

  // Tạo mới phiếu bảo trì
  const addMaintenanceRequest = async (requestData: MaintenanceRequestCreate) => {
    try {
      const response = await maintenanceStore.addMaintenanceRequest(requestData);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo phiếu bảo trì:", error);
      return { success: false, message: "Có lỗi xảy ra khi tạo phiếu bảo trì!" };
    }
  };

  // Duyệt phiếu bảo trì
  const approveMaintenanceRequest = async (requestId: number) => {
    try {
      const response = await maintenanceStore.approveMaintenanceRequest(requestId);
      return response;
    } catch (error) {
      console.error("Lỗi khi duyệt phiếu bảo trì:", error);
      return { success: false, message: "Có lỗi xảy ra khi duyệt phiếu bảo trì!" };
    }
  };

  // Cập nhật phiếu bảo trì
  const updateMaintenanceRequest = async (
    requestId: number,
    updateData: MaintenanceRequestUpdate
  ) => {
    try {
      const response = await maintenanceStore.updateMaintenanceRequest(requestId, updateData);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật phiếu bảo trì:", error);
      return { success: false, message: "Có lỗi xảy ra khi cập nhật phiếu bảo trì!" };
    }
  };

  return {
    fetchMaintenanceRequests,
    fetchMaintenanceRequestById,
    addMaintenanceRequest,
    approveMaintenanceRequest,
    updateMaintenanceRequest,
    maintenanceRequests: computed(() => maintenanceStore.maintenanceRequests || []),
    selectedMaintenanceRequest: computed(() => maintenanceStore.selectedMaintenanceRequest || null)
  };
}
