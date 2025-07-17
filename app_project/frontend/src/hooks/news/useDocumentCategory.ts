import { computed, type Ref } from "vue";
import { useDocumentCategoryStore } from "@/store/news/documentCategoryStore";
import type {
  DocumentCategoryCreate,
  DocumentCategoryUpdate,
  DocumentCategoryResponse,
} from "@/models/news/document";

export function useDocumentCategory(): {
  documentCategoryStore: ReturnType<typeof useDocumentCategoryStore>;

  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  addCategory: (payload: DocumentCategoryCreate) => Promise<void>;
  editCategory: (id: number, payload: DocumentCategoryUpdate) => Promise<void>;
  clearState: () => void;

  categories: Ref<DocumentCategoryResponse[]>;
  selected: Ref<DocumentCategoryResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useDocumentCategoryStore();

  const fetchCategories = () => store.loadCategories();
  const fetchCategoryById = (id: number) => store.loadCategoryById(id);
  const addCategory = (payload: DocumentCategoryCreate) =>
    store.addCategory(payload);
  const editCategory = (id: number, payload: DocumentCategoryUpdate) =>
    store.editCategory(id, payload);
  const clearState = () => store.clearState();

  const categories = computed(() => store.categories);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    documentCategoryStore: store,
    fetchCategories,
    fetchCategoryById,
    addCategory,
    editCategory,
    clearState,
    categories,
    selected,
    loading,
    creating,
    updating,
    error,
    success,
  };
}
