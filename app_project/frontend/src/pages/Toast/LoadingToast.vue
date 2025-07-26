<template>
  <div class="fixed inset-0 z-[9999] pointer-events-none">
    <transition-group
      name="toast-transition"
      tag="div"
      class="fixed bottom-4 right-4 space-y-3"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center w-full max-w-md p-4 bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 text-gray-200 rounded-lg shadow-lg border border-gray-600 backdrop-blur-sm"
      >
        <!-- Spinner container -->
        <div class="shrink-0 mr-3">
          <div class="w-8 h-8 relative">
            <div
              class="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <!-- Message -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium">{{ toast.message }}</div>
          <div v-if="toast.subMessage" class="text-xs text-gray-400 mt-1">
            {{ toast.subMessage }}
          </div>
        </div>

        <!-- Progress bar (optional) -->
        <div
          v-if="toast.progress !== undefined"
          class="absolute bottom-0 left-0 right-0 h-1"
        >
          <div
            class="h-full bg-blue-500 transition-all duration-300 ease-linear"
            :style="{ width: `${toast.progress}%` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { onMounted, getCurrentInstance } from "vue";
import { ToastLoading } from "@/utils/toast-manager";

const instance = getCurrentInstance();
if (instance) {
  onMounted(() => {
    ToastLoading.setInstance(instance);
  });
}

interface Toast {
  id: string;
  message: string;
  subMessage?: string;
  progress?: number;
  duration?: number;
  timer?: ReturnType<typeof setTimeout>;
}

const toasts = ref<Toast[]>([]);

// Hàm hiển thị toast loading
function showLoading(message: string, options: Partial<Toast> = {}) {
  const id = Math.random().toString(36).substring(2, 9);

  const toast: Toast = {
    id,
    message,
    subMessage: options.subMessage,
    progress: options.progress,
    duration: options.duration,
    ...options,
  };

  // Set timeout nếu có duration
  if (toast.duration && toast.duration > 0) {
    toast.timer = setTimeout(() => {
      dismissLoading(id);
    }, toast.duration);
  }

  toasts.value.push(toast);
  return id;
}

// Hàm cập nhật toast
function updateLoading(id: string, updates: Partial<Toast>) {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    // Reset timer nếu cập nhật duration
    if (updates.duration !== undefined) {
      clearTimeout(toasts.value[index].timer);
      if (updates.duration > 0) {
        toasts.value[index].timer = setTimeout(
          () => dismissLoading(id),
          updates.duration
        );
      }
    }

    toasts.value[index] = { ...toasts.value[index], ...updates };
  }
}

// Hàm ẩn toast
function dismissLoading(id: string) {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    clearTimeout(toasts.value[index].timer);
    toasts.value.splice(index, 1);
  }
}

// Tự động dọn dẹp khi component unmount
onBeforeUnmount(() => {
  toasts.value.forEach((toast) => clearTimeout(toast.timer));
  toasts.value = [];
});

// Expose API để có thể gọi từ bên ngoài
defineExpose({ showLoading, updateLoading, dismissLoading });
</script>

<style scoped>
.toast-transition-enter-active,
.toast-transition-leave-active {
  transition: all 0.3s ease;
}
.toast-transition-enter-from,
.toast-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
