import { defineStore } from "pinia";
import { mergePayloadToState } from "@/utils/mergePayloadToState";
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
    // Fetch all
    async loadSlides() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchSlides();
        this.slides = data;
      } catch {
        this.error = "Failed to fetch slides.";
      } finally {
        this.loading = false;
      }
    },

    // Get one
    async getSlideById(id: number) {
      this.loading = true;
      this.selected = null;
      try {
        const data = await getSlide(id);
        this.selected = data;
      } catch {
        this.error = "Failed to get slide.";
      } finally {
        this.loading = false;
      }
    },

    // Create
    async addSlide(payload: SlideCreate) {
      this.creating = true;
      this.error = null;
      try {
        const created = await createSlide(payload);
        this.slides.push(created);
        this.success = "Slide created successfully.";
      } catch {
        this.error = "Failed to create slide.";
      } finally {
        this.creating = false;
      }
    },

    // Update
    async editSlide(id: number, payload: SlideUpdate) {
        this.updating = true;
        this.error = null;
        this.success = null;

        const index = this.slides.findIndex((s) => s.id === id);
        if (index === -1) return;

        const backup = { ...this.slides[index] };

        this.slides[index] = mergePayloadToState<SlideResponse, SlideUpdate>(
            backup,
            payload,
            ['image']
        );

        try {
            const updated = await updateSlide(id, payload);
            this.slides[index] = updated;
            this.success = "Slide updated successfully";
        } catch {
            this.slides[index] = backup;
            this.error = "Failed to update slide.";
        } finally {
            this.updating = false;
        }
    },

    // Delete
    async removeSlide(id: number) {
      this.deleting = true;
      this.error = null;

      const backup = [...this.slides];
      this.slides = this.slides.filter((s) => s.id !== id);

      try {
        await deleteSlide(id);
        this.success = "Slide deleted successfully.";
      } catch {
        this.slides = backup;
        this.error = "Failed to delete slide.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
