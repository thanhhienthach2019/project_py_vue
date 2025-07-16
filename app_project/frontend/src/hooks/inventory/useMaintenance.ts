import { computed } from "vue";
import { useMaintenanceStore } from "@/store/inventory/maintenanceStore";
import type {
  MaintenanceRequestCreate,
  MaintenanceRequestUpdate
} from "@/models/inventory/maintenance";

export function useMaintenance() {
  const maintenanceStore = useMaintenanceStore();

  const handleError = (action: string, error: unknown) => {
    console.error(`An error occurred while ${action}:`, error);
    return { success: false, message: `Failed to ${action}. Please try again.` };
  };

  const fetchMaintenanceRequests = async () => {
    try {
      await maintenanceStore.fetchMaintenanceRequests();
    } catch (error) {
      return handleError("fetching maintenance requests", error);
    }
  };

  const fetchMaintenanceRequestById = async (requestId: number) => {
    try {
      await maintenanceStore.fetchMaintenanceRequestById(requestId);
    } catch (error) {
      return handleError(`fetching maintenance request #${requestId}`, error);
    }
  };

  const addMaintenanceRequest = async (requestData: MaintenanceRequestCreate) => {
    try {
      return await maintenanceStore.addMaintenanceRequest(requestData);
    } catch (error) {
      return handleError("creating maintenance request", error);
    }
  };

  const approveMaintenanceRequest = async (requestId: number) => {
    try {
      return await maintenanceStore.approveMaintenanceRequest(requestId);
    } catch (error) {
      return handleError(`approving maintenance request #${requestId}`, error);
    }
  };

  const deleteMaintenanceRequest = async (requestId: number) => {
    try {
      const deletedItem = maintenanceStore.maintenanceRequests.find(
        (r) => r.RequestID === requestId
      );
      const response = await maintenanceStore.deleteMaintenanceRequest(requestId);
      if (response.success) {
        return { ...response, deletedRequestNumber: deletedItem?.RequestNumber };
      }
      return response;
    } catch (error) {
      return handleError(`deleting maintenance request #${requestId}`, error);
    }
  };

  const updateMaintenanceRequest = async (
    requestId: number,
    updateData: MaintenanceRequestUpdate
  ) => {
    try {
      return await maintenanceStore.updateMaintenanceRequest(requestId, updateData);
    } catch (error) {
      return handleError(`updating maintenance request #${requestId}`, error);
    }
  };

  return {
    fetchMaintenanceRequests,
    fetchMaintenanceRequestById,
    addMaintenanceRequest,
    approveMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
    maintenanceRequests: computed(() => maintenanceStore.maintenanceRequests || []),
    selectedMaintenanceRequest: computed(() => maintenanceStore.selectedMaintenanceRequest || null)
  };
}
