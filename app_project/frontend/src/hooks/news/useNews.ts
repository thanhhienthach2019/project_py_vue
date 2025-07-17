import { computed, type Ref } from "vue";
import { useNewsStore } from "@/store/news/newsStore";
import type {
  NewsCategoryCreate,
  NewsCategoryUpdate,
  NewsCategoryResponse,
  NewsArticleCreate,
  NewsArticleUpdate,
  NewsArticleResponse,
} from "@/models/news/news";

export function useNews(): {
  newsStore: ReturnType<typeof useNewsStore>;

  // Category methods
  fetchCategories: () => Promise<void>;
  getCategory: (id: number) => Promise<void>;
  addCategory: (payload: NewsCategoryCreate) => Promise<void>;
  editCategory: (id: number, payload: NewsCategoryUpdate) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;

  // Article methods
  fetchArticles: () => Promise<void>;
  getArticle: (id: number) => Promise<void>;
  addArticle: (payload: NewsArticleCreate) => Promise<void>;
  editArticle: (id: number, payload: NewsArticleUpdate) => Promise<void>;
  removeArticle: (id: number) => Promise<void>;

  // Reactive state
  categories: Ref<NewsCategoryResponse[]>;
  selectedCategory: Ref<NewsCategoryResponse | null>;
  articles: Ref<NewsArticleResponse[]>;
  selectedArticle: Ref<NewsArticleResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useNewsStore();

  // === Category Methods ===
  const fetchCategories = () => store.loadCategories();
  const getCategory = (id: number) => store.getCategory(id);
  const addCategory = (payload: NewsCategoryCreate) => store.addCategory(payload);
  const editCategory = (id: number, payload: NewsCategoryUpdate) =>
    store.editCategory(id, payload);
  const removeCategory = (id: number) => store.removeCategory(id);

  // === Article Methods ===
  const fetchArticles = () => store.loadArticles();
  const getArticle = (id: number) => store.getArticle(id);
  const addArticle = (payload: NewsArticleCreate) => store.addArticle(payload);
  const editArticle = (id: number, payload: NewsArticleUpdate) =>
    store.editArticle(id, payload);
  const removeArticle = (id: number) => store.removeArticle(id);

  // === Computed state ===
  const categories = computed(() => store.categories);
  const selectedCategory = computed(() => store.selectedCategory);
  const articles = computed(() => store.articles);
  const selectedArticle = computed(() => store.selectedArticle);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    newsStore: store,

    fetchCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory,

    fetchArticles,
    getArticle,
    addArticle,
    editArticle,
    removeArticle,

    categories,
    selectedCategory,
    articles,
    selectedArticle,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
