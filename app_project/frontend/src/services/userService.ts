import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type { UserCreate, UserUpdate, UserResponse } from "@/models/user";

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
  user: UserCreate
): Promise<{ success: boolean; data?: UserResponse; message: string }> => {
  try {
    const response = await apiClient.post("/users", user, getAuthHeaders());

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
  userUpdate: UserUpdate
): Promise<{ success: boolean; data?: UserResponse; message: string }> => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userUpdate, getAuthHeaders());

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
