import { computed } from "vue";
import { useVideoStore } from "@/store/media/videoStore";
import type { VideoCreate, VideoUpdate } from "@/models/media/video";

export function useVideo() {
  const store = useVideoStore();

  // === Actions ===
  const fetchVideos = () => store.loadVideos();
  const getVideo = (id: number) => store.loadVideoDetail(id);
  const addVideo = (payload: VideoCreate) => store.addVideo(payload);
  const editVideo = (id: number, payload: VideoUpdate) =>
    store.editVideo(id, payload);
  const removeVideo = (id: number) => store.removeVideo(id);

  // === State ===
  const videos = computed(() => store.videos);
  const selectedVideo = computed(() => store.selectedVideo);
  const loading = computed(() => store.loading);
  const creating = computed(() => store.creating);
  const updating = computed(() => store.updating);
  const deleting = computed(() => store.deleting);
  const success = computed(() => store.success);
  const error = computed(() => store.error);

  return {
    // Store instance
    videoStore: store,

    // Actions
    fetchVideos,
    getVideo,
    addVideo,
    editVideo,
    removeVideo,

    // State
    videos,
    selectedVideo,
    loading,
    creating,
    updating,
    deleting,
    success,
    error,
  };
}
