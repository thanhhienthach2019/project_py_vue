import { defineStore } from "pinia";
import {
  fetchDonors,
  getDonorDetail,
  createDonor,
  updateDonor,
  deleteDonor,
} from "@/services/news/donorService";
import type {
  DonorResponse,
  DonorCreate,
  DonorUpdate,
} from "@/models/news/donor";

interface DonorState {
  donors: DonorResponse[];
  selectedDonor: DonorResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useDonorStore = defineStore("donor", {
  state: (): DonorState => ({
    donors: [],
    selectedDonor: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
  }),

  actions: {
    async loadDonors() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchDonors();
        if (response.success && response.data) {
          this.donors = response.data;
        } else {
          this.error = response.message;
        }
      } catch (e) {
        this.error = "Failed to load donors.";
      } finally {
        this.loading = false;
      }
    },

    async loadDonorDetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getDonorDetail(id);
        if (response.success && response.data) {
          this.selectedDonor = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to load donor detail.";
      } finally {
        this.loading = false;
      }
    },

    async addDonor(payload: DonorCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await createDonor(payload);
        if (response.success && response.data) {
          this.donors.push(response.data);
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to create donor.";
      } finally {
        this.creating = false;
      }
    },

    async editDonor(id: number, payload: DonorUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await updateDonor(id, payload);
        if (response.success && response.data) {
          const index = this.donors.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.donors[index] = response.data;
          }
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to update donor.";
      } finally {
        this.updating = false;
      }
    },

    async removeDonor(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;
      const backup = [...this.donors];
      this.donors = this.donors.filter((d) => d.id !== id);
      try {
        const response = await deleteDonor(id);
        if (response.success) {
          this.success = response.message;
        } else {
          this.donors = backup;
          this.error = response.message;
        }
      } catch {
        this.donors = backup;
        this.error = "Failed to delete donor.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
