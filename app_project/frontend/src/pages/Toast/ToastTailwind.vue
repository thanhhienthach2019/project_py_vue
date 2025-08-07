<!-- src/pages/Toast/ToastTailwind.vue -->
<template>
  <transition-group
    name="fade"
    tag="div"
    class="fixed bottom-4 right-4 space-y-2 z-50"
  >
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      class="flex items-center w-full max-w-xs p-4 bg-gray-800 text-gray-200 rounded-lg shadow-lg border"
      :class="toast.variant === 'error' ? 'border-red-500' : 'border-green-500'"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
        :class="
          toast.variant === 'error'
            ? 'text-red-500 bg-red-100'
            : 'text-green-500 bg-green-100'
        "
      >
        <svg
          v-if="toast.variant === 'success'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2
               a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0Zm3.536
               13.536a1 1 0 0 1-1.414 1.414L10 11.414l-2.122 2.122a1 1 0 0 1-1.414-1.414L8.586
               10 6.464 7.878a1 1 0 0 1 1.414-1.414L10 8.586l2.122-2.122a1 1 0 0 1 1.414
               1.414L11.414 10l2.122 2.122Z"
          />
        </svg>
      </div>

      <div class="ml-3 text-sm font-normal">{{ toast.message }}</div>

      <button
        @click="toastStore.remove(toast.id)"
        class="ml-auto bg-transparent text-gray-400 hover:text-gray-100 p-1.5 rounded-lg focus:ring-2 focus:ring-gray-300"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          fill="none"
          viewBox="0 0 14 14"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1l6 6m0 0l6
               6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { useToastStore } from "@/store/toast/toastStore";
const toastStore = useToastStore();
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
