<!-- src/App.vue -->
<!-- <template>
  <router-view />
  <ToastTailwind ref="toastRef" />
</template> -->

<template>
  <router-view />
  <!-- <LoadingToast /> -->
  <ToastTailwind ref="toastRef" />
  <!-- <SessionTimeoutModal
    v-if="showSessionModal"
    @refresh="handleRefresh"
    @logout="handleLogout"
  /> -->
</template>

<script setup lang="ts">
import { onMounted, ref, provide, onUnmounted } from "vue";
import { useAuthStore } from "@/store/auth/authStore";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
// import SessionTimeoutModal from "@/components/ui/SessionTimeoutModal.vue";
import { apiClient } from "@/utils/apiClient";

const authStore = useAuthStore();
const toastRef = ref<InstanceType<typeof ToastTailwind> | null>(null);
const showSessionModal = ref(false);
provide("toast", toastRef);

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

// // Xử lý khi người dùng chọn refresh session
// const handleRefresh = async () => {
//   try {
//     await authStore.refreshToken();
//     showSessionModal.value = false;
//     toastRef.value?.showToast("Session renewed successfully", "success");
//   } catch (error) {
//     toastRef.value?.showToast("Failed to renew session", "error");
//     await authStore.logout();
//   }
// };

// // Xử lý khi người dùng chọn logout
// const handleLogout = async () => {
//   await authStore.logout();
//   showSessionModal.value = false;
// };

// Tự động kiểm tra session mỗi 5 phút
let sessionCheckInterval: number;
onMounted(() => {
  sessionCheckInterval = window.setInterval(async () => {
    if (authStore.isAuthenticated) {
      await authStore.checkOrRefreshSession();
    }
  }, 10 * 60 * 1000); // 10 phút
});

onMounted(() => {
  authStore.fetchUser();
});

onUnmounted(() => {
  clearInterval(sessionCheckInterval);
});
</script>
