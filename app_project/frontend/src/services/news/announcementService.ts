import { apiClient } from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  AnnouncementResponse,
  AnnouncementCreate,
  AnnouncementUpdate,
} from "@/models/news/announcement";

const baseUrl = "/announcements";

export const fetchAnnouncements = async (
  skip = 0,
  limit = 100
): Promise<{
  success: boolean;
  data?: AnnouncementResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get(
      `${baseUrl}?skip=${skip}&limit=${limit}`,
      getAuthHeaders()
    );
    return {
      success: true,
      data: response.data,
      message: "Fetched announcements successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch announcements",
    };
  }
};

export const getAnnouncementById = async (
  id: number
): Promise<{
  success: boolean;
  data?: AnnouncementResponse;
  message: string;
}> => {
  try {
    const response = await apiClient.get(`${baseUrl}/${id}`, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched announcement detail successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Failed to fetch announcement detail",
    };
  }
};

export const createAnnouncement = async (
  payload: AnnouncementCreate
): Promise<{
  success: boolean;
  data?: AnnouncementResponse;
  message: string;
}> => {
  try {
    const response = await apiClient.post(baseUrl, payload, getAuthHeaders());
    return {
      success: true,
      data: response.data,
      message: "Announcement created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Failed to create announcement",
    };
  }
};

export const updateAnnouncement = async (
  id: number,
  payload: AnnouncementUpdate
): Promise<{
  success: boolean;
  data?: AnnouncementResponse;
  message: string;
}> => {
  try {
    const response = await apiClient.put(
      `${baseUrl}/${id}`,
      payload,
      getAuthHeaders()
    );
    return {
      success: true,
      data: response.data,
      message: "Announcement updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Failed to update announcement",
    };
  }
};

export const deleteAnnouncement = async (
  id: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await apiClient.delete(`${baseUrl}/${id}`, getAuthHeaders());
    return {
      success: true,
      message: "Announcement deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Failed to delete announcement",
    };
  }
};
