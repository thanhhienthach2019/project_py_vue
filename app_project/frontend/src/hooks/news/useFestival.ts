import { computed, type Ref } from "vue";
import { useFestivalStore } from "@/store/news/festivalStore";
import type {
  FestivalCreate,
  FestivalUpdate,
  FestivalResponse,
} from "@/models/news/festival";

export function useFestival(): {
  festivalStore: ReturnType<typeof useFestivalStore>;

  fetchFestivals: () => Promise<void>;
  fetchFestivalDetail: (id: number) => Promise<void>;
  addFestival: (payload: FestivalCreate) => Promise<void>;
  editFestival: (id: number, payload: FestivalUpdate) => Promise<void>;
  removeFestival: (id: number) => Promise<void>;

  festivals: Ref<FestivalResponse[]>;
  selectedFestival: Ref<FestivalResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useFestivalStore();

  // === Actions ===
  const fetchFestivals = () => store.loadFestivals();
  const fetchFestivalDetail = (id: number) => store.loadFestivalDetail(id);
  const addFestival = (payload: FestivalCreate) => store.addFestival(payload);
  const editFestival = (id: number, payload: FestivalUpdate) =>
    store.editFestival(id, payload);
  const removeFestival = (id: number) => store.removeFestival(id);

  // === Reactive States ===
  const festivals = computed(() => store.festivals);
  const selectedFestival = computed(() => store.selectedFestival);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    festivalStore: store,
    fetchFestivals,
    fetchFestivalDetail,
    addFestival,
    editFestival,
    removeFestival,
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
