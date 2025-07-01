import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Warehouse } from "@/models/warehouse"; // Đảm bảo type này đã được định nghĩa trong project của bạn

// Lấy danh sách tất cả các kho
export const getAllWarehouses = async (): Promise<Warehouse[]> => {
  const response = await apiClient.get("/get_warehouse", getAuthHeaders());
  return response.data;
};

// Tạo mới một kho
export const createWarehouse = async (
  warehouseData: Warehouse
): Promise<{ success: boolean; data?: Warehouse; message: string }> => {
  try {
    const response = await apiClient.post("/add_warehouse", warehouseData, getAuthHeaders());
    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data, message: "Thêm kho thành công!" };
    } else {
      return { success: false, message: "Thêm kho thất bại!" };
    }
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi thêm kho!" };
  }
};

// Cập nhật thông tin một kho dựa vào warehouseId
export const updateWarehouse = async (
  warehouseId: number,
  warehouseData: Warehouse
): Promise<{ success: boolean; data?: Warehouse; message: string }> => {
  try {
    const response = await apiClient.put(`/update_warehouse/${warehouseId}`, warehouseData, getAuthHeaders());
    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data, message: "Cập nhật kho thành công!" };
    } else {
      return { success: false, message: "Cập nhật kho thất bại!" };
    }
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi cập nhật kho!" };
  }
};

// Xoá một kho dựa vào warehouseId
export const deleteWarehouse = async (
  warehouseId: number
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete(`/delete_warehouse/${warehouseId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    return { message: "Có lỗi xảy ra khi xoá kho!" };
  }
};
