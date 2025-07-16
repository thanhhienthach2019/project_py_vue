import apiClient from "@/utils/apiClient";
import { getMultipartHeaders } from "@/utils/getMultipartHeaders";
import type {
  DocumentCreate,
  DocumentUpdate,
  DocumentResponse,
  DocumentCategoryCreate,
  DocumentCategoryUpdate,
  DocumentCategoryResponse,
} from "@/models/news/document";

const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

// ========== DOCUMENT ==========

export const fetchDocuments = async (): Promise<{
  success: boolean;
  data?: DocumentResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/documents", getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched documents successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch documents",
    };
  }
};

export const getDocumentDetail = async (id: number) => {
  try {
    const response = await apiClient.get(`/documents/${id}`, getMultipartHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to get document",
    };
  }
};

export const createDocument = async (data: DocumentCreate) => {
  try {
    const formData = buildFormData(data);
    const response = await apiClient.post("/documents", formData, getMultipartHeaders());
    return { success: true, data: response.data, message: "Document created successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create document",
    };
  }
};

export const updateDocument = async (id: number, data: DocumentUpdate) => {
  try {
    const formData = buildFormData(data);
    const response = await apiClient.put(`/documents/${id}`, formData, getMultipartHeaders());
    return { success: true, data: response.data, message: "Document updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update document",
    };
  }
};

export const deleteDocument = async (id: number) => {
  try {
    await apiClient.delete(`/documents/${id}`, getMultipartHeaders());
    return { success: true, message: "Document deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete document",
    };
  }
};

// ========== CATEGORY ==========

export const fetchDocumentCategories = async (): Promise<{
  success: boolean;
  data?: DocumentCategoryResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/documents/categories", getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched categories successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch categories",
    };
  }
};

export const getCategoryDetail = async (id: number) => {
  try {
    const response = await apiClient.get(`/documents/categories/${id}`, getMultipartHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to get category",
    };
  }
};

export const createCategory = async (data: DocumentCategoryCreate) => {
  try {
    const formData = buildFormData(data);
    const response = await apiClient.post("/documents/categories", formData, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Category created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create category",
    };
  }
};

export const updateCategory = async (id: number, data: DocumentCategoryUpdate) => {
  try {
    const formData = buildFormData(data);
    const response = await apiClient.put(`/documents/categories/${id}`, formData, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Category updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update category",
    };
  }
};
