import { defineStore } from "pinia";
import {
  fetchSlides,
  getSlide,
  createSlide,
  updateSlide,
  deleteSlide,
} from "@/services/news/slideService";

import type {
  SlideCreate,
  SlideUpdate,
  SlideResponse,
} from "@/models/news/slide";

interface SlideState {
  slides: SlideResponse[];
  selected: SlideResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  success: string | null;
  error: string | null;
}

export const useSlideStore = defineStore("slide", {
  state: (): SlideState => ({
    slides: [],
    selected: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    success: null,
    error: null,
  }),

  actions: {
    // 📦 Fetch all slides
    async loadSlides() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchSlides();
        this.slides = data;
      } catch (err) {
        this.error = "Failed to fetch slides.";
      } finally {
        this.loading = false;
      }
    },

    // 🔍 Get a slide by ID
    async getSlideById(id: number) {
      this.loading = true;
      this.selected = null;
      try {
        const data = await getSlide(id);
        this.selected = data;
      } catch (err) {
        this.error = "Failed to get slide.";
      } finally {
        this.loading = false;
      }
    },

    // ➕ Create new slide
    async addSlide(payload: SlideCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const created = await createSlide(payload);
        this.slides.push(created);
        this.success = "Slide created successfully.";
      } catch (err) {
        this.error = "Failed to create slide.";
      } finally {
        this.creating = false;
      }
    },

    // ✏️ Update slide
    async editSlide(id: number, payload: SlideUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;

      const index = this.slides.findIndex((s) => s.id === id);
      if (index === -1) {
        this.error = "Slide not found.";
        this.updating = false;
        return;
      }

      const backup = { ...this.slides[index] };

      try {
        // Optional: show instant optimistic title change before upload finishes
        this.slides[index] = { ...backup, ...payload };

        const updated = await updateSlide(id, payload);
        this.slides[index] = updated;
        this.success = "Slide updated successfully.";
      } catch (err) {
        this.slides[index] = backup;
        this.error = "Failed to update slide.";
      } finally {
        this.updating = false;
      }
    },

    // ❌ Delete slide
    async removeSlide(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;

      const backup = [...this.slides];
      this.slides = this.slides.filter((s) => s.id !== id);

      try {
        await deleteSlide(id);
        this.success = "Slide deleted successfully.";
      } catch (err) {
        this.slides = backup;
        this.error = "Failed to delete slide.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
