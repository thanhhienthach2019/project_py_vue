import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  MaintenanceRequestCreate,
  MaintenanceRequestResponse,
  MaintenanceRequestUpdate
} from "@/models/maintenance";

// Create a maintenance request
export const createMaintenanceRequest = async (
  requestData: MaintenanceRequestCreate
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.post("/maintenance-requests", requestData, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Maintenance request created successfully."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create maintenance request."
    };
  }
};

// Approve a maintenance request
export const approveMaintenanceRequest = async (
  requestId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.patch(
      `/maintenance-requests/${requestId}/approve`,
      null,
      getAuthHeaders()
    );
    return {
      success: true,
      message: response.data.message || "Maintenance request approved successfully."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to approve maintenance request."
    };
  }
};

// Update a maintenance request
export const updateMaintenanceRequest = async (
  requestId: number,
  updateData: MaintenanceRequestUpdate
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.put(
      `/maintenance-requests/${requestId}`,
      updateData,
      getAuthHeaders()
    );
    return {
      success: true,
      data: response.data,
      message: "Maintenance request updated successfully."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update maintenance request."
    };
  }
};

// Delete a maintenance request
export const deleteMaintenanceRequest = async (
  requestId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/maintenance-requests/${requestId}`, getAuthHeaders());
    return {
      success: true,
      message: response.data.message || "Maintenance request deleted successfully."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete maintenance request."
    };
  }
};

// Get all maintenance requests
export const getAllMaintenanceRequests = async (): Promise<{
  success: boolean;
  data?: MaintenanceRequestResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/maintenance-requests", getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Successfully retrieved all maintenance requests."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to retrieve maintenance requests."
    };
  }
};

// Get maintenance request by ID
export const getMaintenanceRequestById = async (
  requestId: number
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.get(`/maintenance-requests/${requestId}`, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Successfully retrieved maintenance request details."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to retrieve maintenance request details."
    };
  }
};
