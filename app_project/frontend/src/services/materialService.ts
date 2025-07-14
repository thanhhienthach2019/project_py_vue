import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Material } from "@/models/material";
import type { MaterialWithStock } from "@/models/materialWithStock";


export const getAllMaterials = async (): Promise<Material[]> => {
    const response = await apiClient.get("/materials");
    return response.data;
};

export const getMaterialById = async (materialId: number): Promise<Material> => {
    const response = await apiClient.get(`/materials/${materialId}`);
    return response.data;
};

export const createMaterial = async (
    materialData: Material
  ): Promise<{ success: boolean; data?: Material; message: string }> => {
    try {
        const formData = new FormData();
        formData.append("MaterialCode", materialData.MaterialCode);
        formData.append("MaterialName", materialData.MaterialName);
        if (materialData.Unit) formData.append("Unit", materialData.Unit);
        if (materialData.Description) formData.append("Description", materialData.Description);
        if (materialData.Model) formData.append("Model", materialData.Model);
        if (materialData.Origin) formData.append("Origin", materialData.Origin);        
        if (materialData.ImageUrl && materialData.ImageUrl instanceof File) {
            formData.append("image", materialData.ImageUrl as File);
        }
        if (materialData.Weight) formData.append("Weight", materialData.Weight.toString());
        if (materialData.Dimensions) formData.append("Dimensions", materialData.Dimensions);

        const response = await apiClient.post("/materials", formData, {
            headers: {
                ...(getAuthHeaders().headers || {}),
            "Content-Type": "multipart/form-data"
            }
        });

        if (response.status === 201 || response.status === 200) {
            return { success: true, data: response.data, message: "Thêm dữ liệu thành công!" };
        } else {
            return { success: false, message: "Thêm dữ liệu thất bại!" };
        }
    } catch (error) {
        return { success: false, message: "Có lỗi xảy ra khi thêm dữ liệu!" };
    }
};

export const updateMaterial = async (materialId: number, materialData: Material): 
    Promise<{ success: boolean; data?: Material; message: string }> => {    
        try {
            const formData = new FormData();
            formData.append("MaterialCode", materialData.MaterialCode);
            formData.append("MaterialName", materialData.MaterialName);
            if (materialData.Unit) formData.append("Unit", materialData.Unit);
            if (materialData.Description) formData.append("Description", materialData.Description);
            if (materialData.Model) formData.append("Model", materialData.Model);
            if (materialData.Origin) formData.append("Origin", materialData.Origin);            
            // Nếu có file mới để upload, thêm file ảnh; nếu không, backend có thể giữ ảnh cũ
            if (materialData.ImageUrl && typeof materialData.ImageUrl === "object" && "name" in materialData.ImageUrl) {
                formData.append("image", materialData.ImageUrl as File);
            }
            if (materialData.Weight) formData.append("Weight", materialData.Weight.toString());
            if (materialData.Dimensions) formData.append("Dimensions", materialData.Dimensions);
            const response = await apiClient.put(`/materials/${materialId}`, formData, {
              headers: {
                  ...(getAuthHeaders().headers || {}),
                  "Content-Type": "multipart/form-data"
              }
            });

            if (response.status === 201 || response.status === 200) {
                return { success: true, data: response.data, message: "Cập nhật dữ liệu thành công!" };
            } else {
                return { success: false, message: "Cập nhật dữ liệu thất bại!" };
            }
        } catch (error) {
            return { success: false, message: "Có lỗi xảy ra khi cập nhật dữ liệu!" };
        }        
  };

export const deleteMaterial = async (materialId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/materials/${materialId}`, getAuthHeaders());
    return response.data;
};

export const getMaterialWithStock = async (
  materialId: number,
  warehouseId: number
): Promise<MaterialWithStock> => {
  try {
    const response = await apiClient.get(
      `/materials/${materialId}/with-stock?warehouse_id=${warehouseId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};