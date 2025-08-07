import { apiClient } from "@/utils/apiClient";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";
import type { GenericResponse } from "@/types/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchPolicies = async (): Promise<GenericResponse<PolicyItem[]>> => {
  try {
    const response = await apiClient.get("/policies/permission");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const fetchPoliciesGroup = async (): Promise<GenericResponse<PolicyItem[]>> => {
  try {
    const response = await apiClient.get("/policies/group");

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const fetchViewPolicies = async (): Promise<GenericResponse<PolicyItem[]>> => {
  try {
    const response = await apiClient.get("/policies/permission/view");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const addPolicy = async (
  policy: PolicyCreate
): Promise<GenericResponse<PolicyItem>> => {
  try {
    const response = await apiClient.post("/policies", policy);
    return {
      success: true,
      data: response.data.data,  
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};


export const deletePolicy = async (
  policy: PolicyCreate
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete("/policies", {data: policy});
    return {
      success: true,
      data: null,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};
