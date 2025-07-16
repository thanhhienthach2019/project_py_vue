import { computed } from "vue";
import { useNewsStore } from "@/store/news/newsStore";
import type {
  NewsCategoryCreate,
  NewsCategoryUpdate,
  NewsArticleCreate,
  NewsArticleUpdate,
} from "@/models/news/news";

export function useNews() {
  const store = useNewsStore();

  // === CATEGORY METHODS ===
  const fetchCategories = () => store.loadCategories();
  const getCategory = (id: number) => store.getCategory(id);
  const addCategory = (payload: NewsCategoryCreate) => store.addCategory(payload);
  const editCategory = (id: number, payload: NewsCategoryUpdate) =>
    store.editCategory(id, payload);
  const removeCategory = (id: number) => store.removeCategory(id);

  // === ARTICLE METHODS ===
  const fetchArticles = () => store.loadArticles();
  const getArticle = (id: number) => store.getArticle(id);
  const addArticle = (payload: NewsArticleCreate) => store.addArticle(payload);
  const editArticle = (id: number, payload: NewsArticleUpdate) =>
    store.editArticle(id, payload);
  const removeArticle = (id: number) => store.removeArticle(id);

  // === STATE ===
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
    // Store instance
    newsStore: store,

    // Category handlers
    fetchCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory,

    // Article handlers
    fetchArticles,
    getArticle,
    addArticle,
    editArticle,
    removeArticle,

    // State
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
