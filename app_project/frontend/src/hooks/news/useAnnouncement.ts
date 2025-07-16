import { computed } from "vue";
import { useAnnouncementStore } from "@/store/news/announcementStore";
import type {
  AnnouncementCreate,
  AnnouncementUpdate,
} from "@/models/news/announcement";

export function useAnnouncement() {
  const store = useAnnouncementStore();

  // === FETCH ===
  const fetchAnnouncements = (skip = 0, limit = 100) =>
    store.loadAnnouncements(skip, limit);

  const fetchAnnouncementById = (id: number) =>
    store.loadAnnouncementById(id);

  // === CREATE ===
  const addAnnouncement = (payload: AnnouncementCreate) =>
    store.addAnnouncement(payload);

  // === UPDATE ===
  const editAnnouncement = (id: number, payload: AnnouncementUpdate) =>
    store.editAnnouncement(id, payload);

  // === DELETE ===
  const removeAnnouncement = (id: number) =>
    store.removeAnnouncement(id);

  // === CLEAR ===
  const clearState = () => store.clearState();

  // === COMPUTED ===
  const announcements = computed(() => store.items);
  const selected = computed(() => store.selected);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const error = computed(() => store.error);
  const success = computed(() => store.success);

  return {
    // Raw store (if needed)
    announcementStore: store,

    // Actions
    fetchAnnouncements,
    fetchAnnouncementById,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    clearState,

    // State
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
