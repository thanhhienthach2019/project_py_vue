import apiClient from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import type {
  ScriptureCategoryCreate,
  ScriptureCategoryUpdate,
  ScriptureCategoryResponse,
  ScriptureCreate,
  ScriptureUpdate,
  ScriptureResponse,
} from "@/models/news/scripture";

// ─── CATEGORY ──────────────────────────────────────────────

export const fetchScriptureCategories = async (): Promise<ScriptureCategoryResponse[]> => {
  const res = await apiClient.get("/scriptures/categories", getAuthHeaders());
  return res.data;
};

export const getScriptureCategory = async (id: number): Promise<ScriptureCategoryResponse> => {
  const res = await apiClient.get(`/scriptures/categories/${id}`, getAuthHeaders());
  return res.data;
};

export const createScriptureCategory = async (
  data: ScriptureCategoryCreate
): Promise<ScriptureCategoryResponse> => {
  const res = await apiClient.post("/scriptures/categories", data, getAuthHeaders());
  return res.data;
};

export const updateScriptureCategory = async (
  id: number,
  data: ScriptureCategoryUpdate
): Promise<ScriptureCategoryResponse> => {
  const res = await apiClient.put(`/scriptures/categories/${id}`, data, getAuthHeaders());
  return res.data;
};

// ─── SCRIPTURE ──────────────────────────────────────────────

export const fetchScriptures = async (): Promise<ScriptureResponse[]> => {
  const res = await apiClient.get("/scriptures", getAuthHeaders());
  return res.data;
};

export const getScripture = async (id: number): Promise<ScriptureResponse> => {
  const res = await apiClient.get(`/scriptures/${id}`, getAuthHeaders());
  return res.data;
};

export const createScripture = async (
  data: ScriptureCreate
): Promise<ScriptureResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await apiClient.post("/scriptures", formData, {
    ...getAuthHeaders().headers,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};

export const updateScripture = async (
  id: number,
  data: ScriptureUpdate
): Promise<ScriptureResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await apiClient.put(`/scriptures/${id}`, formData, {
    ...getAuthHeaders().headers,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};

export const deleteScripture = async (id: number): Promise<void> => {
  await apiClient.delete(`/scriptures/${id}`, getAuthHeaders());
};
