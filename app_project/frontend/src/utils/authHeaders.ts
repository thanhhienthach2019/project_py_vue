export const getAuthHeaders = (extraHeaders = {}) => {
  return {
      headers: {
          ...extraHeaders, 
      },
  };
};
