import { computed, type Ref } from "vue";
import { useVideoStore } from "@/store/media/videoStore";
import type {
  VideoCreate,
  VideoUpdate,
  VideoResponse,
} from "@/models/media/video";

export function useVideo(): {
  videoStore: ReturnType<typeof useVideoStore>;

  // Actions
  fetchVideos: () => Promise<void>;
  getVideo: (id: number) => Promise<void>;
  addVideo: (payload: VideoCreate) => Promise<void>;
  editVideo: (id: number, payload: VideoUpdate) => Promise<void>;
  removeVideo: (id: number) => Promise<void>;

  // State
  videos: Ref<VideoResponse[]>;
  selectedVideo: Ref<VideoResponse | null>;
  loading: Ref<boolean>;
  creating: Ref<boolean>;
  updating: Ref<boolean>;
  deleting: Ref<boolean>;
  success: Ref<string | null>;
  error: Ref<string | null>;
} {
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
    videoStore: store,

    fetchVideos,
    getVideo,
    addVideo,
    editVideo,
    removeVideo,

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
