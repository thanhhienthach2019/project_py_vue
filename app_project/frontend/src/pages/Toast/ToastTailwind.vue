<template>
  <transition name="fade">
    <div
      v-if="visible"
      :id="toastId"
      class="fixed bottom-4 right-4 z-50 flex items-center w-full max-w-xs p-4 mb-4 bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 text-gray-200 rounded-lg shadow-lg border border-gray-600"
      role="alert"
    >
      <!-- Icon container -->
      <div
        class="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
        :class="iconContainerClass"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          :fill="iconFill"
          viewBox="0 0 20 20"
        >
          <path
            v-if="variant === 'success'"
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
          <path
            v-else-if="variant === 'error'"
            d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0Zm3.536 13.536a1 1 0 0 1-1.414 1.414L10 11.414l-2.122 2.122a1 1 0 0 1-1.414-1.414L8.586 10 6.464 7.878a1 1 0 0 1 1.414-1.414L10 8.586l2.122-2.122a1 1 0 0 1 1.414 1.414L11.414 10l2.122 2.122Z"
          />
        </svg>
        <span class="sr-only">
          {{ variant === "success" ? "Check icon" : "Error icon" }}
        </span>
      </div>
      <!-- Message -->
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <!-- Close button -->
      <button
        type="button"
        @click="dismissToast"
        class="ml-auto -mr-1 -mt-1 bg-transparent text-gray-400 hover:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Reactive state
const visible = ref(false);
const message = ref("");
const variant = ref<"success" | "error">("success");
const toastId = ref("toast");

// Hàm hiển thị toast
function showToast(msg: string, type: "success" | "error" = "success", duration = 3000) {  
  message.value = msg;
  variant.value = type;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, duration);
}

// Hàm ẩn toast
function dismissToast() {
  visible.value = false;
}

// Tùy chỉnh lớp cho container icon dựa trên variant
const iconContainerClass = computed(() => {
  return variant.value === "error"
    ? "text-red-500 bg-red-100"
    : "text-green-500 bg-green-100";
});

// Tùy chỉnh fill cho icon SVG
const iconFill = computed(() => "currentColor");

// Expose hàm showToast để có thể gọi từ bên ngoài
defineExpose({ showToast });
// Lắng nghe sự kiện global
function handleToastEvent(e: Event) {
  const customEvent = e as CustomEvent;
  const { message: msg, type } = customEvent.detail;
  showToast(msg, type);
}

onMounted(() => {
  window.addEventListener("show-toast", handleToastEvent);
});

onBeforeUnmount(() => {
  window.removeEventListener("show-toast", handleToastEvent);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
