import { computed } from "vue";
import { useFestivalStore } from "@/store/news/festivalStore";
import type { FestivalCreate, FestivalUpdate } from "@/models/news/festival";

export function useFestival() {
  const store = useFestivalStore();

  // === FETCH ===
  const fetchFestivals = () => store.loadFestivals();
  const fetchFestivalDetail = (id: number) => store.loadFestivalDetail(id);

  // === CREATE ===
  const addFestival = (payload: FestivalCreate) => store.addFestival(payload);

  // === UPDATE ===
  const editFestival = (id: number, payload: FestivalUpdate) =>
    store.editFestival(id, payload);

  // === DELETE ===
  const removeFestival = (id: number) => store.removeFestival(id);

  // === COMPUTED STATE ===
  const festivals = computed(() => store.festivals);
  const selectedFestival = computed(() => store.selectedFestival);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Store
    festivalStore: store,

    // Actions
    fetchFestivals,
    fetchFestivalDetail,
    addFestival,
    editFestival,
    removeFestival,

    // State
    festivals,
    selectedFestival,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
