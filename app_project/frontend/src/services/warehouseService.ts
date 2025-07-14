import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Warehouse } from "@/models/warehouse";

// Get all warehouses
export const getAllWarehouses = async (): Promise<Warehouse[]> => {
  const response = await apiClient.get("/warehouses", getAuthHeaders());
  return response.data;
};

// Create a new warehouse
export const createWarehouse = async (
  warehouseData: Warehouse
): Promise<{ success: boolean; data?: Warehouse; message: string }> => {
  try {
    const response = await apiClient.post("/warehouses", warehouseData, getAuthHeaders());
    return { success: true, data: response.data, message: "Warehouse created successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while creating the warehouse."
    };
  }
};

// Update an existing warehouse
export const updateWarehouse = async (
  warehouseId: number,
  warehouseData: Warehouse
): Promise<{ success: boolean; data?: Warehouse; message: string }> => {
  try {
    const response = await apiClient.put(`/warehouses/${warehouseId}`, warehouseData, getAuthHeaders());
    return { success: true, data: response.data, message: "Warehouse updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while updating the warehouse."
    };
  }
};

// Delete a warehouse
export const deleteWarehouse = async (
  warehouseId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/warehouses/${warehouseId}`, getAuthHeaders());
    return { success: true, message: response.data.message || "Warehouse deleted successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "An error occurred while deleting the warehouse."
    };
  }
};
