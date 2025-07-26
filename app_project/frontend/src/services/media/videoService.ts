import { apiClient } from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  VideoCreate,
  VideoUpdate,
  VideoResponse,
} from "@/models/media/video";

// Helper: build FormData
const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

// ====================== VIDEO SERVICES ======================

export const fetchVideos = async (): Promise<VideoResponse[]> => {
  const res = await apiClient.get("/videos", getAuthHeaders());
  return res.data;
};

export const getVideo = async (id: number): Promise<VideoResponse> => {
  const res = await apiClient.get(`/videos/${id}`, getAuthHeaders());
  return res.data;
};

export const createVideo = async (data: VideoCreate): Promise<VideoResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.post("/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

export const updateVideo = async (
  id: number,
  data: VideoUpdate
): Promise<VideoResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.put(`/videos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

export const deleteVideo = async (id: number): Promise<void> => {
  await apiClient.delete(`/videos/${id}`, getAuthHeaders());
};
