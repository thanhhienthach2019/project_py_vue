import { computed } from "vue";
import { useDonorStore } from "@/store/news/donorStore";
import type { DonorCreate, DonorUpdate } from "@/models/news/donor";

export function useDonor() {
  const store = useDonorStore();

  // === FETCH ===
  const fetchDonors = () => store.loadDonors();
  const fetchDonorDetail = (id: number) => store.loadDonorDetail(id);

  // === CREATE ===
  const addDonor = (payload: DonorCreate) => store.addDonor(payload);

  // === UPDATE ===
  const editDonor = (id: number, payload: DonorUpdate) =>
    store.editDonor(id, payload);

  // === DELETE ===
  const removeDonor = (id: number) => store.removeDonor(id);

  // === COMPUTED STATE ===
  const donors = computed(() => store.donors);
  const selectedDonor = computed(() => store.selectedDonor);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Store
    donorStore: store,

    // Actions
    fetchDonors,
    fetchDonorDetail,
    addDonor,
    editDonor,
    removeDonor,

    // State
    donors,
    selectedDonor,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
