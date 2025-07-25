import { apiClient } from "@/utils/apiClient";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";

export const fetchPolicies = async (): Promise<{
  success: boolean;
  data?: PolicyItem[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/policies/permission");
    return {
      success: true,
      data: response.data,
      message: "Fetched policies permission successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to fetch policies",
      // message: error.response?.data?.detail || "Failed to fetch policies",
    };
  }
};

export const fetchPoliciesGroup = async (): Promise<{
  success: boolean;
  data?: PolicyItem[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/policies/group");

    return {
      success: true,
      data: response.data,
      message: "Fetched policies group successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to fetch policies",
    };
  }
};

export const fetchViewPolicies = async (): Promise<{
  success: boolean;
  data?: PolicyItem[];
  message: string;
}> => {
  try {
    const response = await apiClient.get("/policies/permission/view");
    return {
      success: true,
      data: response.data,
      message: "Fetched view policies successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to fetch view policies",
    };
  }
};

export const addPolicy = async (
  policy: PolicyCreate
): Promise<{ success: boolean; message: string; data?: PolicyItem }> => {
  try {
    const response = await apiClient.post("/policies", policy);
    return {
      success: true,
      message: response.data?.msg || "Policy added successfully",
      data: response.data?.data,  
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to add policy",
    };
  }
};


export const deletePolicy = async (
  policy: PolicyCreate
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete("/policies", {
      data: policy,
    });
    return {
      success: true,
      message: "Policy deleted successfully",
    };
  } catch (error: any) {
    let message = "Failed to delete policy";
    // if (error.response && error.response.data) {
    //   message = error.response.data.detail || message;
    // } else if (error.message) {
    //   message = error.message;
    // }
    return {
      success: false,
      message: message,
    };
  }
};
