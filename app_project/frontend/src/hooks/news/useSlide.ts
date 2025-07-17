import { computed, type Ref } from "vue";
import { useSlideStore } from "@/store/news/slideStore";
import type {
  SlideCreate,
  SlideUpdate,
  SlideResponse,
} from "@/models/news/slide";

export function useSlide(): {
  slideStore: ReturnType<typeof useSlideStore>;

  // Actions
  fetchSlides: () => Promise<void>;
  getSlide: (id: number) => Promise<void>;
  addSlide: (payload: SlideCreate) => Promise<void>;
  editSlide: (id: number, payload: SlideUpdate) => Promise<void>;
  removeSlide: (id: number) => Promise<void>;

  // State
  slides: Ref<SlideResponse[]>;
  selectedSlide: Ref<SlideResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useSlideStore();

  // === Actions ===
  const fetchSlides = () => store.loadSlides();
  const getSlide = (id: number) => store.getSlideById(id);
  const addSlide = (payload: SlideCreate) => store.addSlide(payload);
  const editSlide = (id: number, payload: SlideUpdate) =>
    store.editSlide(id, payload);
  const removeSlide = (id: number) => store.removeSlide(id);

  // === State ===
  const slides = computed(() => store.slides);
  const selectedSlide = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    slideStore: store,

    fetchSlides,
    getSlide,
    addSlide,
    editSlide,
    removeSlide,

    slides,
    selectedSlide,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
