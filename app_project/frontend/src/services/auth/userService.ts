import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type { UserCreate, UserUpdate, UserResponse } from "@/models/auth/user";

export const fetchUsers = async (
  skip: number = 0,
  limit: number = 100,
  is_active: boolean = true
): Promise<{ success: boolean; data?: UserResponse[]; message: string }> => {
  try {
    const response = await apiClient.get("/users", {
      ...getAuthHeaders(),
      params: { skip, limit, is_active }
    });

    return {
      success: true,
      data: response.data,
      message: "Fetched users successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch users",
    };
  }
};

export const fetchUserById = async (
  userId: number
): Promise<{ success: boolean; data?: UserResponse; message: string }> => {
  try {
    const response = await apiClient.get(`/users/${userId}`, getAuthHeaders());

    return {
      success: true,
      data: response.data,
      message: "Fetched user successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to fetch user",
    };
  }
};

export const createUser = async (
  user: UserCreate,              
  imageFile?: File | null       
): Promise<{ success: boolean; data?: UserResponse; message: string }> => {
  try {
    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.full_name) formData.append("full_name", user.full_name);
    if (user.phone_number) formData.append("phone_number", user.phone_number);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await apiClient.post("/users/", formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data,
      message: "User created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create user",
    };
  }
};

export const updateUser = async (
  userId: number,
  userUpdate: UserUpdate,
  imageFile?: File | null
): Promise<{ success: boolean; data?: UserResponse; message: string }> => {
  try {
    const formData = new FormData();

    if (userUpdate.email) formData.append("email", userUpdate.email);
    if (userUpdate.full_name) formData.append("full_name", userUpdate.full_name);
    if (userUpdate.phone_number) formData.append("phone_number", userUpdate.phone_number);
    if (userUpdate.password) formData.append("password", userUpdate.password);
    if (typeof userUpdate.is_active === "boolean")
      formData.append("is_active", String(userUpdate.is_active));
    if (typeof userUpdate.is_verified === "boolean")
      formData.append("is_verified", String(userUpdate.is_verified));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data,
      message: "User updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update user",
    };
  }
};


export const deleteUser = async (
  userId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.delete(`/users/${userId}`, getAuthHeaders());

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete user",
    };
  }
};
