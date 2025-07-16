import { defineStore } from "pinia";
import {
  fetchVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/services/media/videoService";
import type {
  VideoResponse,
  VideoCreate,
  VideoUpdate,
} from "@/models/media/video";
import { mergePayloadToState } from "@/utils/mergePayloadToState"; 

interface VideoState {
  videos: VideoResponse[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
  selectedVideo: VideoResponse | null;
}

export const useVideoStore = defineStore("video", {
  state: (): VideoState => ({
    videos: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    success: null,
    selectedVideo: null,
  }),

  actions: {
    async loadVideos() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchVideos();
        this.videos = data;
      } catch (e) {
        this.error = "Failed to fetch videos.";
      } finally {
        this.loading = false;
      }
    },

    async loadVideoDetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedVideo = await getVideo(id);
      } catch {
        this.error = "Failed to fetch video detail.";
      } finally {
        this.loading = false;
      }
    },

    async addVideo(payload: VideoCreate) {
      this.creating = true;
      this.error = null;
      this.success = null;

      try {
        const created = await createVideo(payload);
        this.videos.push(created);
        this.success = "Video created successfully";
      } catch {
        this.error = "Failed to create video.";
      } finally {
        this.creating = false;
      }
    },

    async editVideo(id: number, payload: VideoUpdate) {
      this.updating = true;
      this.error = null;
      this.success = null;

      const index = this.videos.findIndex((v) => v.id === id);
      if (index === -1) return;

      const backup = { ...this.videos[index] };
      this.videos[index] = mergePayloadToState<VideoResponse, VideoUpdate>(
        backup,
        payload,
        ["thumbnail"]
      );

      try {
        const updated = await updateVideo(id, payload);
        this.videos[index] = updated;
        this.success = "Video updated successfully";
      } catch {
        this.videos[index] = backup;
        this.error = "Failed to update video.";
      } finally {
        this.updating = false;
      }
    },

    async removeVideo(id: number) {
      this.deleting = true;
      this.error = null;
      this.success = null;

      const backup = [...this.videos];
      this.videos = this.videos.filter((v) => v.id !== id);

      try {
        await deleteVideo(id);
        this.success = "Video deleted successfully";
      } catch {
        this.videos = backup;
        this.error = "Failed to delete video.";
      } finally {
        this.deleting = false;
      }
    },
  },
});
