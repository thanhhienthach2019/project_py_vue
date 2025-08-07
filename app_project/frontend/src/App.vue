<template>
  <router-view />
  <ToastTailwind />
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { useAuthStore } from "@/store/auth/authStore";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { apiClient } from "@/utils/apiClient";
import { loadPreferredLanguage } from "@/utils/lang";

const authStore = useAuthStore();
const showSessionModal = ref(false);

// Xử lý khi phát hiện token hết hạn
const handleTokenExpired = () => {
  showSessionModal.value = true;
};

// Đăng ký global handler
apiClient.interceptors.response.use(null, (error) => {
  if (
    error.response?.status === 401 &&
    !error.config.url.includes("/auth/refresh-token")
  ) {
    handleTokenExpired();
  }
  return Promise.reject(error);
});

let sessionCheckInterval: number;
onMounted(() => {
  sessionCheckInterval = window.setInterval(async () => {
    if (authStore.isAuthenticated) {
      await authStore.checkOrRefreshSession();
    }
  }, 10 * 60 * 1000); // 10 phút
});

onMounted(() => {
  loadPreferredLanguage();
  authStore.fetchUser();
});

onUnmounted(() => {
  clearInterval(sessionCheckInterval);
});
</script>
