import type { Ref } from "vue";
import { computed } from "vue";
import { useAnnouncementStore } from "@/store/news/announcementStore";
import type {
  AnnouncementCreate,
  AnnouncementUpdate,
} from "@/models/news/announcement";

export function useAnnouncement(): {
  announcementStore: ReturnType<typeof useAnnouncementStore>;

  fetchAnnouncements: (skip?: number, limit?: number) => Promise<void>;
  fetchAnnouncementById: (id: number) => Promise<void>;
  addAnnouncement: (payload: AnnouncementCreate) => Promise<void>;
  editAnnouncement: (id: number, payload: AnnouncementUpdate) => Promise<void>;
  removeAnnouncement: (id: number) => Promise<void>;
  clearState: () => void;

  announcements: Ref<any[]>;
  selected: Ref<any | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<string | null>;
} {
  const store = useAnnouncementStore();

  const fetchAnnouncements = (skip = 0, limit = 100) =>
    store.loadAnnouncements(skip, limit);

  const fetchAnnouncementById = (id: number) =>
    store.loadAnnouncementById(id);

  const addAnnouncement = (payload: AnnouncementCreate) =>
    store.addAnnouncement(payload);

  const editAnnouncement = (id: number, payload: AnnouncementUpdate) =>
    store.editAnnouncement(id, payload);

  const removeAnnouncement = (id: number) =>
    store.removeAnnouncement(id);

  const clearState = () => store.clearState();

  const announcements = computed(() => store.items);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    announcementStore: store,
    fetchAnnouncements,
    fetchAnnouncementById,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    clearState,
    announcements,
    selected,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
  };
}
