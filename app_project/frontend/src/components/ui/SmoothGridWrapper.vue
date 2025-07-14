<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

const props = defineProps<{
  loading: boolean;
  columns?: number; // Số cột của grid, mặc định là 3
}>();

const ready = ref(false);
const columns = props.columns || 3;

// Theo dõi trạng thái loading
watch(
  () => props.loading,
  async (newVal) => {
    if (newVal) {
      ready.value = false; // Hiển thị skeleton khi loading
    } else {
      await nextTick(); // Đợi DOM cập nhật
      setTimeout(() => {
        ready.value = true; // Chuyển sang nội dung chính sau 300ms
      }, 300); // Delay 300ms để tạo hiệu ứng mượt
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative w-full">
    <!-- Skeleton loading khi đang tải -->
    <div v-if="loading || !ready" aria-label="Đang tải nội dung">
      <slot name="loading">
        <div
          class="grid gap-4"
          :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
        >
          <div
            v-for="i in columns * 2"
            :key="i"
            class="h-40 bg-skeleton rounded animate-pulse"
          ></div>
        </div>
      </slot>
    </div>

    <!-- Nội dung chính với transition -->
    <transition name="fade" mode="out-in">
      <div v-if="!loading && ready" aria-live="polite">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Hiệu ứng fade mượt mà */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Màu skeleton sử dụng CSS variable */
.bg-skeleton {
  background-color: var(--skeleton-color, #e5e7eb);
}
</style>
