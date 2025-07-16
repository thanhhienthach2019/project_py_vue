// services/news/festivalService.ts

import apiClient from "@/utils/apiClient";
import { getMultipartHeaders } from "@/utils/getMultipartHeaders";
import type {
  FestivalCreate,
  FestivalUpdate,
  FestivalResponse
} from "@/models/news/festival";

const baseUrl = "/festivals";

export const createFestival = async (
  payload: FestivalCreate
): Promise<{ success: boolean; data?: FestivalResponse; message: string }> => {
  try {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("start_date", payload.start_date);
    form.append("is_active", String(payload.is_active));

    if (payload.description) form.append("description", payload.description);
    if (payload.end_date) form.append("end_date", payload.end_date);
    if (payload.location) form.append("location", payload.location);
    if (payload.image) form.append("image", payload.image);

    const response = await apiClient.post(baseUrl, form, getMultipartHeaders());
    return { success: true, data: response.data, message: "Festival created successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create festival",
    };
  }
};

export const updateFestival = async (
  id: number,
  payload: FestivalUpdate
): Promise<{ success: boolean; data?: FestivalResponse; message: string }> => {
  try {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("start_date", payload.start_date);
    form.append("is_active", String(payload.is_active));

    if (payload.description) form.append("description", payload.description);
    if (payload.end_date) form.append("end_date", payload.end_date);
    if (payload.location) form.append("location", payload.location);
    if (payload.image) form.append("image", payload.image);

    const response = await apiClient.put(`${baseUrl}/${id}`, form, getMultipartHeaders());
    return { success: true, data: response.data, message: "Festival updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update festival",
    };
  }
};

export const deleteFestival = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`${baseUrl}/${id}`, getMultipartHeaders());
    return { success: true, message: "Festival deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete festival",
    };
  }
};

export const fetchFestivals = async (): Promise<{
  success: boolean;
  data?: FestivalResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get(baseUrl, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched festivals successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch festivals",
    };
  }
};

export const getFestivalDetail = async (
  id: number
): Promise<{ success: boolean; data?: FestivalResponse; message: string }> => {
  try {
    const response = await apiClient.get(`${baseUrl}/${id}`, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched festival detail successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch festival detail",
    };
  }
};
