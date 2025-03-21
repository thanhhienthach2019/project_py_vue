export const getAuthHeaders = (extraHeaders = {}) => {
  return {
      headers: {
          ...extraHeaders, // Thêm headers tùy chọn nếu cần
      },
  };
};
