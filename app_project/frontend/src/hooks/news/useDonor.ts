import { computed, type Ref } from "vue";
import { useDonorStore } from "@/store/news/donorStore";
import type {
  DonorCreate,
  DonorUpdate,
  DonorResponse,
} from "@/models/news/donor";

export function useDonor(): {
  donorStore: ReturnType<typeof useDonorStore>;

  fetchDonors: () => Promise<void>;
  fetchDonorDetail: (id: number) => Promise<void>;
  addDonor: (payload: DonorCreate) => Promise<void>;
  editDonor: (id: number, payload: DonorUpdate) => Promise<void>;
  removeDonor: (id: number) => Promise<void>;

  donors: Ref<DonorResponse[]>;
  selectedDonor: Ref<DonorResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useDonorStore();

  const fetchDonors = () => store.loadDonors();
  const fetchDonorDetail = (id: number) => store.loadDonorDetail(id);
  const addDonor = (payload: DonorCreate) => store.addDonor(payload);
  const editDonor = (id: number, payload: DonorUpdate) =>
    store.editDonor(id, payload);
  const removeDonor = (id: number) => store.removeDonor(id);

  const donors = computed(() => store.donors);
  const selectedDonor = computed(() => store.selectedDonor);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    donorStore: store,
    fetchDonors,
    fetchDonorDetail,
    addDonor,
    editDonor,
    removeDonor,
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
