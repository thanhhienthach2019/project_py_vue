import { computed } from "vue";
import { useDocumentStore } from "@/store/news/documentStore";
import type {
  DocumentCreate,
  DocumentUpdate,
} from "@/models/news/document";

export function useDocument() {
  const store = useDocumentStore();

  // === FETCH ===
  const fetchDocuments = () => store.loadDocuments();
  const fetchDocumentById = (id: number) => store.loadDocumentById(id);

  // === CREATE ===
  const addDocument = (payload: DocumentCreate) => store.addDocument(payload);

  // === UPDATE ===
  const editDocument = (id: number, payload: DocumentUpdate) =>
    store.editDocument(id, payload);

  // === DELETE ===
  const removeDocument = (id: number) => store.removeDocument(id);

  // === RESET ===
  const clearState = () => store.clearState();

  // === COMPUTED STATE ===
  const documents = computed(() => store.items);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Raw store (if needed for advanced access)
    documentStore: store,

    // Actions
    fetchDocuments,
    fetchDocumentById,
    addDocument,
    editDocument,
    removeDocument,
    clearState,

    // Reactive state
    documents,
    selected,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
