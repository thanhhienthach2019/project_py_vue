import { defineStore } from "pinia";
import { getAllMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from "@/services/material";
import type { Material } from "@/models/material";

interface MaterialState {
    materials: Material[];
    selectedMaterial: Material | null;
}

export const useMaterialStore = defineStore("material", {
    state: (): MaterialState => ({
        materials: [],
        selectedMaterial: null,
    }),
    actions: {
        async fetchMaterials() {
            try {
                const response = await getAllMaterials();
                this.materials = response;
            }catch (error) {
                console.error("Lỗi khi lấy danh sách vật tư: ", error);
            }
        },

        async fetchMaterialById(materialId: number) {
            try {
                const response = await getMaterialById(materialId);
                this.selectedMaterial = response;
            }catch (error) {
                console.error("Lỗi khi lấy vật tư: ", error);
            }
        },

        async addMaterial(materialData: Material) {
            try {
                const newMaterial = await createMaterial(materialData);
                this.materials.push(newMaterial);
            } catch (error) {
                console.error("Lỗi khi thêm vật tư:", error);
            }
        },

        async editMaterial(materialId: number, materialData: Material) {
            try {
                const updatedMaterial = await updateMaterial(materialId, materialData);
                this.materials = this.materials.map(mat => mat.MaterialID == materialId ? updatedMaterial : mat);

            } catch (error) {
                console.error("Lỗi khi cập nhật vật tư: ", error);
            }
        },

        async removeMaterial(materialId: number) {
            try {
                await deleteMaterial(materialId);
                this.materials = this.materials.filter(mat => mat.MaterialID !== materialId);
            } catch (error) {
                console.error("Lỗi khi xoá vật tư: ", error);
            }
        }
    }
})