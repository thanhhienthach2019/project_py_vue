// src/services/maintenance.ts

import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  MaintenanceRequestCreate,
  MaintenanceRequestResponse,
  MaintenanceRequestUpdate
} from "@/models/maintenance";

export const createMaintenanceRequest = async (
  requestData: MaintenanceRequestCreate
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.post("/maintenance-requests", requestData, getAuthHeaders());
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Maintenance request created successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to create maintenance request."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while creating the maintenance request."
    };
  }
};

export const approveMaintenanceRequest = async (
  requestId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(
      "/approve-maintenance-request",
      null,
      {
        ...getAuthHeaders(),
        params: { request_id: requestId }
      }
    );
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message || "Maintenance request approved successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to approve maintenance request."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while approving the maintenance request."
    };
  }
};

export const updateMaintenanceRequest = async (
  requestId: number,
  updateData: MaintenanceRequestUpdate
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.put(
      `/update-maintenance-request/${requestId}`,
      updateData,
      getAuthHeaders()
    );
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Maintenance request updated successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to update maintenance request."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while updating the maintenance request."
    };
  }
};

export const deleteMaintenanceRequest = async (
  requestId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(
      `/delete-maintenance-request/${requestId}`,
      getAuthHeaders()
    );
    if (response.status === 200) {
      return {
        success: true,
        message: "Maintenance request deleted successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to delete maintenance request."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while deleting the maintenance request."
    };
  }
};

export const getAllMaintenanceRequests = async (): Promise<{ success: boolean; data?: MaintenanceRequestResponse[]; message: string }> => {
  try {
    const response = await apiClient.get("/maintenance-requests", getAuthHeaders());
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Successfully retrieved maintenance requests."
      };
    } else {
      return {
        success: false,
        message: "Failed to retrieve maintenance requests."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while retrieving maintenance requests."
    };
  }
};

export const getMaintenanceRequestById = async (
  requestId: number
): Promise<{ success: boolean; data?: MaintenanceRequestResponse; message: string }> => {
  try {
    const response = await apiClient.get(`/maintenance-requests/${requestId}`, getAuthHeaders());
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Successfully retrieved maintenance request details."
      };
    } else {
      return {
        success: false,
        message: "Failed to retrieve maintenance request details."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while retrieving maintenance request details."
    };
  }
};
