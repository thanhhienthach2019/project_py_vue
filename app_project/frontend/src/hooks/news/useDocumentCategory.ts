import { computed } from "vue";
import { useDocumentCategoryStore } from "@/store/news/documentCategoryStore";
import type {
  DocumentCategoryCreate,
  DocumentCategoryUpdate,
} from "@/models/news/document";

export function useDocumentCategory() {
  const store = useDocumentCategoryStore();

  // === FETCH ===
  const fetchCategories = () => store.loadCategories();
  const fetchCategoryById = (id: number) => store.loadCategoryById(id);

  // === CREATE ===
  const addCategory = (payload: DocumentCategoryCreate) =>
    store.addCategory(payload);

  // === UPDATE ===
  const editCategory = (id: number, payload: DocumentCategoryUpdate) =>
    store.editCategory(id, payload);

  // === RESET ===
  const clearState = () => store.clearState();

  // === COMPUTED STATE ===
  const categories = computed(() => store.categories);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Raw store if needed
    documentCategoryStore: store,

    // Actions
    fetchCategories,
    fetchCategoryById,
    addCategory,
    editCategory,
    clearState,

    // Reactive state
    categories,
    selected,
    loading,
    creating,
    updating,
    error,
    success,
  };
}
