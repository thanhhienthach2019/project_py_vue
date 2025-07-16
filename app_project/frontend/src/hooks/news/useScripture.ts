import { computed } from "vue";
import { useScriptureStore } from "@/store/news/scriptureStore";
import type {
  ScriptureCreate,
  ScriptureUpdate,
  ScriptureCategoryCreate,
  ScriptureCategoryUpdate,
} from "@/models/news/scripture";

export function useScripture() {
  const store = useScriptureStore();

  // === SCRIPTURE ===
  const fetchScriptures = () => store.loadScriptures();
  const getScripture = (id: number) => store.getScriptureById(id);
  const addScripture = (payload: ScriptureCreate) => store.addScripture(payload);
  const editScripture = (id: number, payload: ScriptureUpdate) =>
    store.editScripture(id, payload);
  const removeScripture = (id: number) => store.removeScripture(id);

  // === CATEGORIES ===
  const fetchCategories = () => store.loadCategories();
  const getCategory = (id: number) => store.getCategoryById(id);
  const addCategory = (payload: ScriptureCategoryCreate) =>
    store.addCategory(payload);
  const editCategory = (id: number, payload: ScriptureCategoryUpdate) =>
    store.editCategory(id, payload);

  // === STATE ===
  const scriptures = computed(() => store.items);
  const selectedScripture = computed(() => store.selectedItem);
  const categories = computed(() => store.categories);
  const selectedCategory = computed(() => store.selectedCategory);

  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Store instance
    scriptureStore: store,

    // Scripture methods
    fetchScriptures,
    getScripture,
    addScripture,
    editScripture,
    removeScripture,

    // Category methods
    fetchCategories,
    getCategory,
    addCategory,
    editCategory,

    // State
    scriptures,
    selectedScripture,
    categories,
    selectedCategory,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
