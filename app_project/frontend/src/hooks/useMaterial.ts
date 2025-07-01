import { computed } from "vue";
import { useMaterialStore } from "@/store/materialStore";

export function useMaterial() {
    const materialStore = useMaterialStore();

    // Lấy danh sách vật tư
    const fetchMaterials = async () => {
        try {
            await materialStore.fetchMaterials();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách vật tư:", error);
        }
    };

    // Lấy thông tin vật tư theo ID
    const fetchMaterialById = async (materialId: number) => {
        try {
            await materialStore.fetchMaterialById(materialId);
        } catch (error) {
            console.error("Lỗi khi lấy vật tư theo ID:", error);
        }
    };

    // Thêm mới vật tư
    const addMaterial = async (materialData: any) => {
        try {
            const response = await materialStore.addMaterial(materialData);
            return response; 
        } catch (error) {
            console.error("Lỗi khi thêm vật tư:", error);
            return { success: false, message: "Có lỗi xảy ra khi thêm vật tư!" };
        }
    };

    // Chỉnh sửa vật tư
    const editMaterial = async (materialId: number, materialData: any) => {
        try {
            const response = await materialStore.editMaterial(materialId, materialData);
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật vật tư:", error);
        }
    };

    // Xóa vật tư
    const removeMaterial = async (materialId: number) => {
        try {
            await materialStore.removeMaterial(materialId);
        } catch (error) {
            console.error("Lỗi khi xóa vật tư:", error);
        }
    };

    // Lấy thông tin vật tư kèm tồn kho theo materialId và warehouseId
    const fetchMaterialWithStock = async (materialId: number, warehouseId: number) => {
        try {
            const data = await materialStore.fetchMaterialWithStock(materialId, warehouseId);
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy vật tư kèm tồn kho:", error);
        }
    };

    return {
        fetchMaterials,
        fetchMaterialById, 
        addMaterial,
        editMaterial,
        removeMaterial,
        fetchMaterialWithStock,
        materials: computed(() => materialStore.materials || []),  // Đảm bảo luôn trả về mảng
        selectedMaterial: computed(() => materialStore.selectedMaterial || null), // Đảm bảo không bị undefined
        materialWithStock: computed(() => materialStore.materialWithStock || null)
    };
}
