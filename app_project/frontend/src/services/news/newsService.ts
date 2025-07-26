import { apiClient } from "@/utils/apiClient";
import { getAuthHeaders } from "@/utils/authHeaders";
import { getMultipartHeaders } from "@/utils/getMultipartHeaders";
import type {
  NewsCategoryCreate,
  NewsCategoryUpdate,
  NewsCategoryResponse,
  NewsArticleCreate,
  NewsArticleUpdate,
  NewsArticleResponse,
} from "@/models/news/news";

// ========== CATEGORY ==========

export const fetchNewsCategories = async (): Promise<NewsCategoryResponse[]> => {
  const res = await apiClient.get("/news/categories", getAuthHeaders());
  return res.data;
};

export const getNewsCategory = async (id: number): Promise<NewsCategoryResponse> => {
  const res = await apiClient.get(`/news/categories/${id}`, getAuthHeaders());
  return res.data;
};

export const createNewsCategory = async (data: NewsCategoryCreate): Promise<NewsCategoryResponse> => {
  const res = await apiClient.post("/news/categories", data, getAuthHeaders());
  return res.data;
};

export const updateNewsCategory = async (
  id: number,
  data: NewsCategoryUpdate
): Promise<NewsCategoryResponse> => {
  const res = await apiClient.put(`/news/categories/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteNewsCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/news/categories/${id}`, getAuthHeaders());
};

// ========== ARTICLE ==========

function buildFormData(data: NewsArticleCreate | NewsArticleUpdate): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}

export const fetchNewsArticles = async (): Promise<NewsArticleResponse[]> => {
  const res = await apiClient.get("/news", getAuthHeaders());
  return res.data;
};

export const getNewsArticleBySlug = async (
  id: number,
  slug: string
): Promise<NewsArticleResponse> => {
  const res = await apiClient.get(`/news/details/${id}/${slug}`, getAuthHeaders());
  return res.data;
};

export const getNewsArticle = async (id: number): Promise<NewsArticleResponse> => {
  const res = await apiClient.get(`/news/${id}`, getAuthHeaders());
  return res.data;
};

export const createNewsArticle = async (
  data: NewsArticleCreate
): Promise<NewsArticleResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.post("/news", formData, getMultipartHeaders());
  return res.data;
};

export const updateNewsArticle = async (
  id: number,
  data: NewsArticleUpdate
): Promise<NewsArticleResponse> => {
  const formData = buildFormData(data);
  const res = await apiClient.put(`/news/${id}`, formData, getMultipartHeaders());
  return res.data;
};

export const deleteNewsArticle = async (id: number): Promise<void> => {
  await apiClient.delete(`/news/${id}`, getAuthHeaders());
};
