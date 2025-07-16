import { computed } from "vue";
import { useSlideStore } from "@/store/news/slideStore";
import type { SlideCreate, SlideUpdate } from "@/models/news/slide";

export function useSlide() {
  const store = useSlideStore();

  // === Slide Actions ===
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
    // Store instance
    slideStore: store,

    // Actions
    fetchSlides,
    getSlide,
    addSlide,
    editSlide,
    removeSlide,

    // State
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
