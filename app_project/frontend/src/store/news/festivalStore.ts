import { defineStore } from "pinia";
import {
  fetchFestivals,
  getFestivalDetail,
  createFestival,
  updateFestival,
  deleteFestival,
} from "@/services/news/festivalService";
import type {
  FestivalCreate,
  FestivalUpdate,
  FestivalResponse,
} from "@/models/news/festival";

interface FestivalState {
  festivals: FestivalResponse[];
  selectedFestival: FestivalResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useFestivalStore = defineStore("festival", {
  state: (): FestivalState => ({
    festivals: [],
    selectedFestival: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
  }),

  actions: {
    async loadFestivals() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchFestivals();
        if (response.success && response.data) {
          this.festivals = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to load festivals.";
      } finally {
        this.loading = false;
      }
    },

    async loadFestivalDetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getFestivalDetail(id);
        if (response.success && response.data) {
          this.selectedFestival = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to load festival detail.";
      } finally {
        this.loading = false;
      }
    },

    async addFestival(payload: FestivalCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await createFestival(payload);
        if (response.success && response.data) {
          this.festivals.push(response.data);
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to create festival.";
      } finally {
        this.creating = false;
      }
    },

    async editFestival(id: number, payload: FestivalUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await updateFestival(id, payload);
        if (response.success && response.data) {
          const index = this.festivals.findIndex((f) => f.id === id);
          if (index !== -1) {
            this.festivals[index] = response.data;
          }
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to update festival.";
      } finally {
        this.updating = false;
      }
    },

    async removeFestival(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;
      const backup = [...this.festivals];
      this.festivals = this.festivals.filter((f) => f.id !== id);
      try {
        const response = await deleteFestival(id);
        if (response.success) {
          this.success = response.message;
        } else {
          this.festivals = backup;
          this.error = response.message;
        }
      } catch {
        this.festivals = backup;
        this.error = "Failed to delete festival.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
