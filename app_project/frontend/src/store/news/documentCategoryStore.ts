import { defineStore } from "pinia";
import {
  fetchDocumentCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
} from "@/services/news/documentService";

import type {
  DocumentCategoryCreate,
  DocumentCategoryUpdate,
  DocumentCategoryResponse,
} from "@/models/news/document";

interface CategoryState {
  categories: DocumentCategoryResponse[];
  selected: DocumentCategoryResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
  success: string | null;
}

export const useDocumentCategoryStore = defineStore("documentCategory", {
  state: (): CategoryState => ({
    categories: [],
    selected: null,
    loading: false,
    creating: false,
    updating: false,
    error: null,
    success: null,
  }),

  actions: {
    async loadCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchDocumentCategories();
        if (response.success && response.data) {
          this.categories = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Unexpected error while fetching categories.";
      } finally {
        this.loading = false;
      }
    },

    async loadCategoryById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getCategoryDetail(id);
        if (response.success && response.data) {
          this.selected = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Unexpected error while fetching category.";
      } finally {
        this.loading = false;
      }
    },

    async addCategory(payload: DocumentCategoryCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await createCategory(payload);
        if (response.success && response.data) {
          this.categories.push(response.data);
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to create category.";
      } finally {
        this.creating = false;
      }
    },

    async editCategory(id: number, payload: DocumentCategoryUpdate) {
        this.updating = true;
        this.error = null;
        this.success = null;

        try {
            const response = await updateCategory(id, payload);
            if (response.success && response.data) {
            const index = this.categories.findIndex((c) => c.id === id);
            if (index !== -1) {
                this.categories[index] = response.data;
            }
            this.success = response.message;
            } else {
            this.error = response.message;
            }
        } catch {
            this.error = "Failed to update category.";
        } finally {
            this.updating = false;
        }
    },
    
    clearState() {
      this.categories = [];
      this.selected = null;
      this.error = null;
      this.success = null;
    },
  },
});
