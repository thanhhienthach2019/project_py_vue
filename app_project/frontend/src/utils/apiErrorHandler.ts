// src/utils/apiErrorHandler.ts
import type { GenericResponse } from "@/types/api";

export function handleApiError<T = undefined>(
  error: any,
  fallback = "error.unknown"
): GenericResponse<T> {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  if (status === 403) {
    return {
      success: false,
      data: undefined,
      message: undefined,  
      args: {},
    };
  }

  return {
    success: false,
    data: undefined,
    message: detail?.message || fallback,
    args: detail?.args || {},
  };
}
