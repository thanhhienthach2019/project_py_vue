import { defineStore } from "pinia";
import { mergePayloadToState } from "@/utils/mergePayloadToState";
import {
  fetchNewsCategories,
  getNewsCategory,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
  fetchNewsArticles,
  getNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getNewsArticleBySlug
} from "@/services/news/newsService";

import type {
  NewsCategoryCreate,
  NewsCategoryUpdate,
  NewsCategoryResponse,
  NewsArticleCreate,
  NewsArticleUpdate,
  NewsArticleResponse,
} from "@/models/news/news";

interface NewsStoreState {
  categories: NewsCategoryResponse[];
  selectedCategory: NewsCategoryResponse | null;
  articles: NewsArticleResponse[];
  selectedArticle: NewsArticleResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useNewsStore = defineStore("news", {
  state: (): NewsStoreState => ({
    categories: [],
    selectedCategory: null,
    articles: [],
    selectedArticle: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
  }),

  actions: {
    // ===== CATEGORIES =====
    async loadCategories() {
      this.loading = true;
      this.error = null;
      try {
        this.categories = await fetchNewsCategories();
      } catch (err) {
        this.error = "Failed to fetch categories.";
      } finally {
        this.loading = false;
      }
    },

    async getCategory(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedCategory = await getNewsCategory(id);
      } catch {
        this.error = "Failed to fetch category detail.";
      } finally {
        this.loading = false;
      }
    },

    async addCategory(payload: NewsCategoryCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const category = await createNewsCategory(payload);
        this.categories.push(category);
        this.success = "Category created successfully";
      } catch {
        this.error = "Failed to create category.";
      } finally {
        this.creating = false;
      }
    },

    async editCategory(id: number, payload: NewsCategoryUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;
      const index = this.categories.findIndex((c) => c.id === id);
      if (index === -1) return;

      const backup = { ...this.categories[index] };
      this.categories[index] = { ...backup, ...payload };

      try {
        const updated = await updateNewsCategory(id, payload);
        this.categories[index] = updated;
        this.success = "Category updated successfully";
      } catch {
        this.categories[index] = backup;
        this.error = "Failed to update category.";
      } finally {
        this.updating = false;
      }
    },

    async removeCategory(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;
      const backup = [...this.categories];
      this.categories = this.categories.filter((c) => c.id !== id);

      try {
        await deleteNewsCategory(id);
        this.success = "Category deleted successfully";
      } catch {
        this.categories = backup;
        this.error = "Failed to delete category.";
      } finally {
        this.deleting = false;
      }
    },

    // ===== ARTICLES =====
    async loadArticles() {
      this.loading = true;
      this.error = null;
      try {
        this.articles = await fetchNewsArticles();
      } catch {
        this.error = "Failed to fetch articles.";
      } finally {
        this.loading = false;
      }
    },

    async getArticle(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedArticle = await getNewsArticle(id);
      } catch {
        this.error = "Failed to fetch article detail.";
      } finally {
        this.loading = false;
      }
    },

    async getArticleBySlug(id: number, slug: string) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedArticle = await getNewsArticleBySlug(id, slug);
      } catch {
        this.error = "Failed to fetch article by slug.";
      } finally {
        this.loading = false;
      }
    },

    async addArticle(payload: NewsArticleCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const article = await createNewsArticle(payload);
        this.articles.push(article);
        this.success = "Article created successfully";
      } catch {
        this.error = "Failed to create article.";
      } finally {
        this.creating = false;
      }
    },

    async editArticle(id: number, payload: NewsArticleUpdate) {
        this.updating = true;
        this.error = null;
        this.success = null;

        const index = this.articles.findIndex((a) => a.id === id);
        if (index === -1) return;

        const backup = { ...this.articles[index] };

        this.articles[index] = mergePayloadToState<NewsArticleResponse, NewsArticleUpdate>(backup, payload, ['image']);

        try {
            const updated = await updateNewsArticle(id, payload);
            this.articles[index] = updated;
            this.success = "Article updated successfully";
        } catch {
            this.articles[index] = backup;
            this.error = "Failed to update article.";
        } finally {
            this.updating = false;
        }
    },

    async removeArticle(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;
      const backup = [...this.articles];
      this.articles = this.articles.filter((a) => a.id !== id);

      try {
        await deleteNewsArticle(id);
        this.success = "Article deleted successfully";
      } catch {
        this.articles = backup;
        this.error = "Failed to delete article.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
