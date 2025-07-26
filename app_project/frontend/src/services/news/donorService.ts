import { apiClient } from "@/utils/apiClient";
import { getMultipartHeaders } from "@/utils/getMultipartHeaders";
import type {
  DonorCreate,
  DonorUpdate,
  DonorResponse,
} from "@/models/news/donor";

export const fetchDonors = async (): Promise<{
  success: boolean;
  data?: DonorResponse[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/donors", getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched donors successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch donors",
    };
  }
};

export const getDonorDetail = async (
  id: number
): Promise<{ success: boolean; data?: DonorResponse; message: string }> => {
  try {
    const response = await apiClient.get(`/donors/${id}`, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Fetched donor detail successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch donor detail",
    };
  }
};

export const createDonor = async (
  donor: DonorCreate
): Promise<{ success: boolean; data?: DonorResponse; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("full_name", donor.full_name);
    formData.append("donation_amount", donor.donation_amount.toString());
    if (donor.message) formData.append("message", donor.message);
    if (donor.image) formData.append("image", new Blob([donor.image]));

    const response = await apiClient.post("/donors", formData, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Donor created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create donor",
    };
  }
};

export const updateDonor = async (
  donorId: number,
  donor: DonorUpdate
): Promise<{ success: boolean; data?: DonorResponse; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("full_name", donor.full_name);
    formData.append("donation_amount", donor.donation_amount.toString());
    if (donor.message) formData.append("message", donor.message);
    if (donor.image) formData.append("image", new Blob([donor.image]));

    const response = await apiClient.put(`/donors/${donorId}`, formData, getMultipartHeaders());
    return {
      success: true,
      data: response.data,
      message: "Donor updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update donor",
    };
  }
};

export const deleteDonor = async (
  donorId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`/donors/${donorId}`, getMultipartHeaders());
    return {
      success: true,
      message: "Donor deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete donor",
    };
  }
};
