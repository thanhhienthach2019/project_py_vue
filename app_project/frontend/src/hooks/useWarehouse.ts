import { computed } from "vue";
import { useWarehouseStore } from "@/store/warehouseStore";

export function useWarehouse() {
  const warehouseStore = useWarehouseStore();

  // Lấy danh sách kho
  const fetchWarehouses = async () => {
    try {
      await warehouseStore.fetchWarehouses();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho:", error);
    }
  };

  // Thêm mới kho
  const addWarehouse = async (warehouseData: any) => {
    try {
      const response = await warehouseStore.addWarehouse(warehouseData);
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm kho:", error);
      return { success: false, message: "Có lỗi xảy ra khi thêm kho!" };
    }
  };

  // Chỉnh sửa thông tin kho
  const editWarehouse = async (warehouseId: number, warehouseData: any) => {
    try {
      const response = await warehouseStore.editWarehouse(warehouseId, warehouseData);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật kho:", error);
      return { success: false, message: "Có lỗi xảy ra khi cập nhật kho!" };
    }
  };

  // Xoá kho
  const removeWarehouse = async (warehouseId: number) => {
    try {
      await warehouseStore.removeWarehouse(warehouseId);
    } catch (error) {
      console.error("Lỗi khi xoá kho:", error);
    }
  };

  return {
    fetchWarehouses,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
    warehouses: computed(() => warehouseStore.warehouses || []),
    selectedWarehouse: computed(() => warehouseStore.selectedWarehouse || null)
  };
}
