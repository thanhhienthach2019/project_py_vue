import { defineStore } from "pinia";
import {
  fetchDocuments,
  getDocumentDetail,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/services/news/documentService";

import type {
  DocumentCreate,
  DocumentUpdate,
  DocumentResponse,
} from "@/models/news/document";

interface DocumentState {
  items: DocumentResponse[];
  selected: DocumentResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
}

export const useDocumentStore = defineStore("document", {
  state: (): DocumentState => ({
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
    async loadDocuments() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchDocuments();
        if (response.success && response.data) {
          this.items = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Unexpected error while fetching documents.";
      } finally {
        this.loading = false;
      }
    },

    async loadDocumentById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getDocumentDetail(id);
        if (response.success && response.data) {
          this.selected = response.data;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Unexpected error while fetching document detail.";
      } finally {
        this.loading = false;
      }
    },

    async addDocument(payload: DocumentCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;
      try {
        const response = await createDocument(payload);
        if (response.success && response.data) {
          this.items.unshift(response.data);
          this.success = response.message;
        } else {
          this.error = response.message;
        }
      } catch {
        this.error = "Failed to create document.";
      } finally {
        this.creating = false;
      }
    },

    async editDocument(id: number, payload: DocumentUpdate) {
        this.updating = true;
        this.error = null;
        this.success = null;

        try {
            const response = await updateDocument(id, payload);
            if (response.success && response.data) {
                const index = this.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    this.items[index] = response.data;
                }
                this.success = response.message;
                } else {
                this.error = response.message;
                }
            } catch {
                this.error = "Failed to update document.";
        } finally {
            this.updating = false;
        }
    },

    async removeDocument(id: number) {
      const backup = [...this.items];
      this.items = this.items.filter((doc) => doc.id !== id);
      this.deleting = true;
      this.error = null;
      this.success = null;

      try {
        const response = await deleteDocument(id);
        if (response.success) {
          this.success = response.message;
        } else {
          this.items = backup;
          this.error = response.message;
        }
      } catch {
        this.items = backup;
        this.error = "Failed to delete document.";
      } finally {
        this.deleting = false;
      }
    },

    clearState() {
      this.items = [];
      this.selected = null;
      this.error = null;
      this.success = null;
    },
  },
});
