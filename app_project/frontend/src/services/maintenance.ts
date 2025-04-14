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
        message: "Tạo phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Thêm phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Có lỗi xảy ra khi tạo phiếu bảo trì!"
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
        message: response.data.message || "Duyệt phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Duyệt phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Có lỗi xảy ra khi duyệt phiếu bảo trì!"
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
        message: "Cập nhật phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Cập nhật phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Có lỗi xảy ra khi cập nhật phiếu bảo trì!"
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
        message: "Xóa phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Xóa phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail ||
        "Có lỗi xảy ra khi xóa phiếu bảo trì!"
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
        message: "Lấy danh sách phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Lấy danh sách phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Có lỗi xảy ra khi lấy danh sách phiếu bảo trì!"
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
        message: "Lấy thông tin phiếu bảo trì thành công!"
      };
    } else {
      return {
        success: false,
        message: "Lấy thông tin phiếu bảo trì thất bại!"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Có lỗi xảy ra khi lấy thông tin phiếu bảo trì!"
    };
  }
};
