import { defineStore } from "pinia";
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from "@/services/warehouseService";
import type { Warehouse } from "@/models/warehouse";

interface WarehouseState {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
}

export const useWarehouseStore = defineStore("warehouse", {
  state: (): WarehouseState => ({
    warehouses: [],
    selectedWarehouse: null,
  }),
  actions: {
    async fetchWarehouses() {
      try {
        const response = await getAllWarehouses();
        this.warehouses = response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kho: ", error);
      }
    },

    async addWarehouse(warehouseData: Warehouse) {
      try {
        const response = await createWarehouse(warehouseData);
        if (response.success && response.data) {
          this.warehouses.push(response.data);
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi thêm kho:", error);
        return { success: false, message: "Có lỗi xảy ra khi thêm kho!" };
      }
    },

    async editWarehouse(warehouseId: number, warehouseData: Warehouse) {
      try {
        const updatedWarehouse = await updateWarehouse(warehouseId, warehouseData);
        if (updatedWarehouse.success && updatedWarehouse.data) {
          this.warehouses = this.warehouses.map(wh =>
            wh.WarehouseID === warehouseId ? updatedWarehouse.data! : wh
          );
        }
        return updatedWarehouse;
      } catch (error) {
        console.error("Lỗi khi cập nhật kho: ", error);
        return { success: false, message: "Có lỗi xảy ra khi cập nhật kho!" };
      }
    },

    async removeWarehouse(warehouseId: number) {
      try {
        await deleteWarehouse(warehouseId);
        this.warehouses = this.warehouses.filter(wh => wh.WarehouseID !== warehouseId);
      } catch (error) {
        console.error("Lỗi khi xoá kho: ", error);
      }
    },    
  }
});
