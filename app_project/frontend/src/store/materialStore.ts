import { defineStore } from "pinia";
import { 
  getAllMaterials, 
  getMaterialById, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial,
  getMaterialWithStock 
} from "@/services/materialService";
import type { Material } from "@/models/material";
import type { MaterialWithStock } from "@/models/materialWithStock";

interface MaterialState {
  materials: Material[];
  selectedMaterial: Material | null;
  materialWithStock: MaterialWithStock | null;
}

export const useMaterialStore = defineStore("material", {
  state: (): MaterialState => ({
    materials: [],
    selectedMaterial: null,
    materialWithStock: null,
  }),
  actions: {
    async fetchMaterials() {
      try {
        const response = await getAllMaterials();
        this.materials = response;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vật tư: ", error);
      }
    },

    async fetchMaterialById(materialId: number) {
      try {
        const response = await getMaterialById(materialId);
        this.selectedMaterial = response;
      } catch (error) {
        console.error("Lỗi khi lấy vật tư: ", error);
      }
    },

    async addMaterial(materialData: Material) {
      try {
         const response = await createMaterial(materialData);
        if (response.success && response.data) {
          this.materials.push(response.data);
        }
        return response;
      } catch (error) {
        console.error("Lỗi khi thêm vật tư:", error);
        return { success: false, message: "Có lỗi xảy ra khi thêm vật tư!" };
      }
    },

    async editMaterial(materialId: number, materialData: Material) {
      try {
        const updatedMaterial = await updateMaterial(materialId, materialData);
        if (updatedMaterial.success && updatedMaterial.data) {
          this.materials = this.materials.map(mat =>
            mat.MaterialID === materialId ? updatedMaterial.data! : mat
          );
        }
        return updatedMaterial;
      } catch (error) {
        console.error("Lỗi khi cập nhật vật tư: ", error);
        return { success: false, message: "Có lỗi xảy ra khi cập nhật vật tư!" };
      }
    },

    async removeMaterial(materialId: number) {
      try {
        await deleteMaterial(materialId);
        this.materials = this.materials.filter(mat => mat.MaterialID !== materialId);
      } catch (error) {
        console.error("Lỗi khi xoá vật tư: ", error);
      }
    },

    async fetchMaterialWithStock(materialId: number, warehouseId: number) {
      try {
        const response = await getMaterialWithStock(materialId, warehouseId);
        this.materialWithStock = response;
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy vật tư kèm tồn kho: ", error);
      }
    }
  }
});
