import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  SlideCreate,
  SlideUpdate,
  SlideResponse,
} from "@/models/news/slide";

// Helper: convert JS object to FormData
const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

// ====================== SLIDE SERVICES ======================

export const fetchSlides = async (): Promise<SlideResponse[]> => {
  const res = await apiClient.get("/slides", getAuthHeaders());
  return res.data;
};

export const getSlide = async (id: number): Promise<SlideResponse> => {
  const res = await apiClient.get(`/slides/${id}`, getAuthHeaders());
  return res.data;
};

export const createSlide = async (data: SlideCreate): Promise<SlideResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.post("/slides", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

export const updateSlide = async (
  id: number,
  data: SlideUpdate
): Promise<SlideResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.put(`/slides/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

export const deleteSlide = async (id: number): Promise<void> => {
  await apiClient.delete(`/slides/${id}`, getAuthHeaders());
};
