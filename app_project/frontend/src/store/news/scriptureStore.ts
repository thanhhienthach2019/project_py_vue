import { defineStore } from "pinia";
import {
  fetchScriptures,
  getScripture,
  createScripture,
  updateScripture,
  deleteScripture,
  fetchScriptureCategories,
  getScriptureCategory,
  createScriptureCategory,
  updateScriptureCategory,
} from "@/services/news/scriptureService";

import type {
  ScriptureResponse,
  ScriptureCreate,
  ScriptureUpdate,
  ScriptureCategoryResponse,
  ScriptureCategoryCreate,
  ScriptureCategoryUpdate,
} from "@/models/news/scripture";

interface ScriptureState {
  items: ScriptureResponse[];
  categories: ScriptureCategoryResponse[];
  selectedItem: ScriptureResponse | null;
  selectedCategory: ScriptureCategoryResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useScriptureStore = defineStore("scripture", {
  state: (): ScriptureState => ({
    items: [],
    categories: [],
    selectedItem: null,
    selectedCategory: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
  }),

  actions: {
    // ────── SCRIPTURE ──────

    async loadScriptures() {
      this.loading = true;
      try {
        const data = await fetchScriptures();
        this.items = data;
      } catch {
        this.error = "Failed to load scriptures.";
      } finally {
        this.loading = false;
      }
    },

    async getScriptureById(id: number) {
      this.loading = true;
      this.selectedItem = null;
      try {
        const data = await getScripture(id);
        this.selectedItem = data;
      } catch {
        this.error = "Failed to get scripture.";
      } finally {
        this.loading = false;
      }
    },

    async addScripture(payload: ScriptureCreate) {
      this.creating = true;
      this.error = null;
      try {
        const created = await createScripture(payload);
        this.items.push(created);
        this.success = "Scripture created successfully.";
      } catch {
        this.error = "Failed to create scripture.";
      } finally {
        this.creating = false;
      }
    },

    async editScripture(id: number, payload: ScriptureUpdate) {
      this.updating = true;
      this.error = null;

      const index = this.items.findIndex((s) => s.id === id);
      if (index === -1) return;

      const backup = { ...this.items[index] };
      this.items[index] = { ...backup, ...payload };

      try {
        const updated = await updateScripture(id, payload);
        this.items[index] = updated;
        this.success = "Scripture updated successfully.";
      } catch {
        this.items[index] = backup;
        this.error = "Failed to update scripture.";
      } finally {
        this.updating = false;
      }
    },

    async removeScripture(id: number) {
      this.deleting = true;
      const backup = [...this.items];
      this.items = this.items.filter((s) => s.id !== id);

      try {
        await deleteScripture(id);
        this.success = "Scripture deleted successfully.";
      } catch {
        this.items = backup;
        this.error = "Failed to delete scripture.";
      } finally {
        this.deleting = false;
      }
    },

    // ────── CATEGORY ──────

    async loadCategories() {
      try {
        const data = await fetchScriptureCategories();
        this.categories = data;
      } catch {
        this.error = "Failed to load scripture categories.";
      }
    },

    async getCategoryById(id: number) {
      this.loading = true;
      this.selectedCategory = null;
      try {
        const data = await getScriptureCategory(id);
        this.selectedCategory = data;
      } catch {
        this.error = "Failed to get category.";
      } finally {
        this.loading = false;
      }
    },

    async addCategory(payload: ScriptureCategoryCreate) {
      this.creating = true;
      this.error = null;
      try {
        const created = await createScriptureCategory(payload);
        this.categories.push(created);
        this.success = "Category created successfully.";
      } catch {
        this.error = "Failed to create category.";
      } finally {
        this.creating = false;
      }
    },

    async editCategory(id: number, payload: ScriptureCategoryUpdate) {
      this.updating = true;
      this.error = null;

      const index = this.categories.findIndex((c) => c.id === id);
      if (index === -1) return;

      const backup = { ...this.categories[index] };
      this.categories[index] = { ...backup, ...payload };

      try {
        const updated = await updateScriptureCategory(id, payload);
        this.categories[index] = updated;
        this.success = "Category updated successfully.";
      } catch {
        this.categories[index] = backup;
        this.error = "Failed to update category.";
      } finally {
        this.updating = false;
      }
    },
  },
});
