import { computed, type Ref } from "vue";
import { useScriptureStore } from "@/store/news/scriptureStore";
import type {
  ScriptureCreate,
  ScriptureUpdate,
  ScriptureResponse,
  ScriptureCategoryCreate,
  ScriptureCategoryUpdate,
  ScriptureCategoryResponse,
} from "@/models/news/scripture";

export function useScripture(): {
  scriptureStore: ReturnType<typeof useScriptureStore>;

  // Scripture methods
  fetchScriptures: () => Promise<void>;
  getScripture: (id: number) => Promise<void>;
  addScripture: (payload: ScriptureCreate) => Promise<void>;
  editScripture: (id: number, payload: ScriptureUpdate) => Promise<void>;
  removeScripture: (id: number) => Promise<void>;

  // Category methods
  fetchCategories: () => Promise<void>;
  getCategory: (id: number) => Promise<void>;
  addCategory: (payload: ScriptureCategoryCreate) => Promise<void>;
  editCategory: (id: number, payload: ScriptureCategoryUpdate) => Promise<void>;

  // Reactive state
  scriptures: Ref<ScriptureResponse[]>;
  selectedScripture: Ref<ScriptureResponse | null>;
  categories: Ref<ScriptureCategoryResponse[]>;
  selectedCategory: Ref<ScriptureCategoryResponse | null>;

  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useScriptureStore();

  // === Scripture Methods ===
  const fetchScriptures = () => store.loadScriptures();
  const getScripture = (id: number) => store.getScriptureById(id);
  const addScripture = (payload: ScriptureCreate) => store.addScripture(payload);
  const editScripture = (id: number, payload: ScriptureUpdate) =>
    store.editScripture(id, payload);
  const removeScripture = (id: number) => store.removeScripture(id);

  // === Category Methods ===
  const fetchCategories = () => store.loadCategories();
  const getCategory = (id: number) => store.getCategoryById(id);
  const addCategory = (payload: ScriptureCategoryCreate) =>
    store.addCategory(payload);
  const editCategory = (id: number, payload: ScriptureCategoryUpdate) =>
    store.editCategory(id, payload);

  // === State ===
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
    scriptureStore: store,

    fetchScriptures,
    getScripture,
    addScripture,
    editScripture,
    removeScripture,

    fetchCategories,
    getCategory,
    addCategory,
    editCategory,

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
