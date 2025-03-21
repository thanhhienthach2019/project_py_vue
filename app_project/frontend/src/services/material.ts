import { getAuthHeaders } from "@/utils/authHeaders";
import apiClient from "@/utils/apiClient";
import type { Material } from "@/models/material";

export const getAllMaterials = async (): Promise<Material[]> => {
    const response = await apiClient.get("/materials", getAuthHeaders());
    return response.data;
};

export const getMaterialById = async (materialId: number): Promise<Material> => {
    const response = await apiClient.get(`/materials/${materialId}`, getAuthHeaders());
    return response.data;
};

export const createMaterial = async (materialData: Material): Promise<Material> => {
    const response = await apiClient.post("/add_material", materialData, getAuthHeaders());
    return response.data;
};

export const updateMaterial = async (materialId: number, materialData: Material): Promise<Material> => {
    const response = await apiClient.put(`/update_material/${materialId}`, materialData, getAuthHeaders());
    return response.data;
};

export const deleteMaterial = async (materialId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/delete_material/${materialId}`, getAuthHeaders());
    return response.data;
};
