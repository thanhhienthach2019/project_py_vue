import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Machine } from "@/models/machine";

// Get all machines
export const getAllMachines = async (): Promise<{ success: boolean; data?: Machine[]; message: string }> => {
  try {
    const response = await apiClient.get("/machines", getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Successfully retrieved machine list."
    };
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
    const response = await apiClient.get(`/machines/${machineId}`, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Successfully retrieved machine details."
    };
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
    const response = await apiClient.post("/machines", machineData, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Machine created successfully."
    };
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
    const response = await apiClient.put(`/machines/${machineId}`, machineData, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Machine updated successfully."
    };
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
    await apiClient.delete(`/machines/${machineId}`, getAuthHeaders());
    return {
      success: true,
      message: "Machine deleted successfully."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while deleting the machine."
    };
  }
};
