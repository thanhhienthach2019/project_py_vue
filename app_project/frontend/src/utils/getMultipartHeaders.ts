// utils/getMultipartHeaders.ts

import { getAuthHeaders } from "./authHeaders";

export const getMultipartHeaders = () => {
  const baseHeaders = getAuthHeaders().headers || {};

  return {
    headers: {
      ...baseHeaders,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };
};
