import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Machine } from "@/models/machine";

// Get all machines
export const getAllMachines = async (): Promise<{ success: boolean; data?: Machine[]; message: string }> => {
  try {
    const response = await apiClient.get("/get_machines", getAuthHeaders());
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Successfully retrieved machine list."
      };
    } else {
      return {
        success: false,
        message: "Failed to retrieve machine list."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while fetching the machine list."
    };
  }
};

// Get a machine by ID
export const getMachineById = async (
  machineId: number
): Promise<{ success: boolean; data?: Machine; message: string }> => {
  try {
    const response = await apiClient.get(`/get_machine/${machineId}`, getAuthHeaders());
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Successfully retrieved machine details."
      };
    } else {
      return {
        success: false,
        message: "Failed to retrieve machine details."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while fetching machine details."
    };
  }
};

// Create a new machine
export const createMachine = async (
  machineData: Machine
): Promise<{ success: boolean; data?: Machine; message: string }> => {
  try {
    const response = await apiClient.post("/add_machine", machineData, getAuthHeaders());
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Machine created successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to create machine."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while creating the machine."
    };
  }
};

// Update a machine
export const updateMachine = async (
  machineId: number,
  machineData: Machine
): Promise<{ success: boolean; data?: Machine; message: string }> => {
  try {
    const response = await apiClient.put(`/update_machine/${machineId}`, machineData, getAuthHeaders());
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Machine updated successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to update machine."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while updating the machine."
    };
  }
};

// Delete a machine
export const deleteMachine = async (
  machineId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/delete_machine/${machineId}`, getAuthHeaders());
    if (response.status === 200) {
      return {
        success: true,
        message: "Machine deleted successfully."
      };
    } else {
      return {
        success: false,
        message: "Failed to delete machine."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while deleting the machine."
    };
  }
};
