import { apiClient } from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  MyProfileUpdate,
  ChangePassword,
  UserResponse,
} from "@/models/auth/user";
import type { GenericResponse } from "@/types/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchMyProfile = async (): Promise<
  GenericResponse<UserResponse>
> => {
  try {
    const response = await apiClient.get("/profile", getAuthHeaders());
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateMyProfile = async (
  profile: MyProfileUpdate,
  imageFile?: File | null,
  removeImage: boolean = false
): Promise<GenericResponse<UserResponse>> => {
  try {
    const formData = new FormData();

    if (profile.full_name !== undefined)
      formData.append("full_name", profile.full_name);
    if (profile.email !== undefined) formData.append("email", profile.email);
    if (profile.phone_number !== undefined)
      formData.append("phone_number", profile.phone_number);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (removeImage) {
      formData.append("remove_image", "true");
    }

    const response = await apiClient.put("/profile", formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const changeMyPassword = async (
  payload: ChangePassword
): Promise<GenericResponse<null>> => {
  try {
    const response = await apiClient.put(
      "/profile/change-password",
      payload,
      getAuthHeaders()
    );
    return {
      success: true,
      data: null,
      message: response.data.message,
      args: response.data.args,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};
