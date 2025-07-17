import { computed, type Ref } from "vue";
import { useDocumentStore } from "@/store/news/documentStore";
import type {
  DocumentCreate,
  DocumentUpdate,
  DocumentResponse,
} from "@/models/news/document";

export function useDocument(): {
  documentStore: ReturnType<typeof useDocumentStore>;

  fetchDocuments: () => Promise<void>;
  fetchDocumentById: (id: number) => Promise<void>;
  addDocument: (payload: DocumentCreate) => Promise<void>;
  editDocument: (id: number, payload: DocumentUpdate) => Promise<void>;
  removeDocument: (id: number) => Promise<void>;
  clearState: () => void;

  documents: Ref<DocumentResponse[]>;
  selected: Ref<DocumentResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useDocumentStore();

  const fetchDocuments = () => store.loadDocuments();
  const fetchDocumentById = (id: number) => store.loadDocumentById(id);
  const addDocument = (payload: DocumentCreate) => store.addDocument(payload);
  const editDocument = (id: number, payload: DocumentUpdate) =>
    store.editDocument(id, payload);
  const removeDocument = (id: number) => store.removeDocument(id);
  const clearState = () => store.clearState();

  const documents = computed(() => store.items);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    documentStore: store,
    fetchDocuments,
    fetchDocumentById,
    addDocument,
    editDocument,
    removeDocument,
    clearState,
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
