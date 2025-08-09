import { apiClient } from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type { UserCreate, UserUpdate, UserResponse } from "@/models/auth/user";
import type { GenericResponse } from "@/types/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchUsers = async (): Promise<GenericResponse<UserResponse[]>> => {
  try {
    const response = await apiClient.get("/users", getAuthHeaders());
    return {
      success: true,
      data: response.data.data,      
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const fetchUserById = async (
  userId: string
): Promise<GenericResponse<UserResponse>> => {
  try {
    const response = await apiClient.get(`/users/${userId}`, getAuthHeaders());

    return {
      success: true,
      data: response.data.data,      
    };
  } catch (error: any) {
    return handleApiError(error)
  }
};

export const createUser = async (
  user: UserCreate,              
  imageFile?: File | null,
  removeImage: boolean = false     
): Promise<GenericResponse<UserResponse>> => {
  try {
    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.full_name) formData.append("full_name", user.full_name);
    if (user.phone_number) formData.append("phone_number", user.phone_number);

    if (imageFile) {
      formData.append("image", imageFile);
    }else if (removeImage) {
      formData.append("remove_image", "true"); 
    }

    const response = await apiClient.post("/users/", formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });

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

export const updateUser = async (
  userId: string,
  userUpdate: UserUpdate,
  imageFile?: File | null,
  removeImage: boolean = false
): Promise<GenericResponse<UserResponse>> => {
  try {
    const formData = new FormData();

    if (userUpdate.email) formData.append("email", userUpdate.email);
    if (userUpdate.full_name) formData.append("full_name", userUpdate.full_name);
    if (userUpdate.version !== undefined && userUpdate.version !== null) 
      formData.append("version", String(userUpdate.version));
    if (userUpdate.phone_number) formData.append("phone_number", userUpdate.phone_number);
    if (userUpdate.password) formData.append("password", userUpdate.password);
    if (typeof userUpdate.is_active === "boolean")
      formData.append("is_active", String(userUpdate.is_active));
    if (typeof userUpdate.is_verified === "boolean")
      formData.append("is_verified", String(userUpdate.is_verified));

    if (imageFile) {
      formData.append("image", imageFile); 
    } else if (removeImage) {
      formData.append("remove_image", "true"); 
    }

    const response = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });

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


export const deleteUser = async (
  userId: string
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.delete(`/users/${userId}`, getAuthHeaders());

    return {
      data: undefined,
      success: true,
      message: response.data.message,
      args: response.data.args
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};
