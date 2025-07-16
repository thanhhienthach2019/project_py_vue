import { defineStore } from "pinia";
import {
  fetchAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/news/announcementService";
import type {
  AnnouncementCreate,
  AnnouncementUpdate,
  AnnouncementResponse,
} from "@/models/news/announcement";

interface AnnouncementState {
  items: AnnouncementResponse[];
  selected: AnnouncementResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useAnnouncementStore = defineStore("announcement", {
  state: (): AnnouncementState => ({
    items: [],
    selected: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
  }),

  actions: {
    // ===== LOAD LIST =====
    async loadAnnouncements(skip = 0, limit = 100) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchAnnouncements(skip, limit);
        if (response.success && response.data) {
          this.items = response.data;
        } else {
          this.error = response.message;
        }
      } catch (err) {
        this.error = "Unexpected error loading announcements";
      } finally {
        this.loading = false;
      }
    },

    // ===== GET DETAIL =====
    async loadAnnouncementById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAnnouncementById(id);
        if (response.success && response.data) {
          this.selected = response.data;
        } else {
          this.error = response.message;
        }
      } catch (err) {
        this.error = "Unexpected error loading announcement detail";
      } finally {
        this.loading = false;
      }
    },

    // ===== CREATE =====
    async addAnnouncement(payload: AnnouncementCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;

      try {
        const response = await createAnnouncement(payload);
        if (response.success && response.data) {
          this.items.unshift(response.data); // prepend
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch (err) {
        this.error = "Failed to create announcement";
      } finally {
        this.creating = false;
      }
    },

    // ===== UPDATE =====
    async editAnnouncement(id: number, payload: AnnouncementUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;

      const index = this.items.findIndex((item) => item.id === id);
      if (index === -1) {
        this.error = "Announcement not found";
        this.updating = false;
        return;
      }

      const backup = { ...this.items[index] };
      this.items[index] = { ...backup, ...payload };

      try {
        const response = await updateAnnouncement(id, payload);
        if (response.success && response.data) {
          this.items[index] = response.data;
          this.success = response.message;
        } else {
          this.items[index] = backup;
          this.error = response.message;
        }
      } catch (err) {
        this.items[index] = backup;
        this.error = "Failed to update announcement";
      } finally {
        this.updating = false;
      }
    },

    // ===== DELETE =====
    async removeAnnouncement(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;

      const backup = [...this.items];
      this.items = this.items.filter((item) => item.id !== id);

      try {
        const response = await deleteAnnouncement(id);
        if (response.success) {
          this.success = response.message;
        } else {
          this.items = backup;
          this.error = response.message;
        }
      } catch (err) {
        this.items = backup;
        this.error = "Failed to delete announcement";
      } finally {
        this.deleting = false;
      }
    },

    // ===== RESET STATE =====
    clearState() {
      this.items = [];
      this.selected = null;
      this.loading = false;
      this.creating = false;
      this.updating = false;
      this.deleting = false;
      this.error = null;
      this.success = null;
    },
  },
});
