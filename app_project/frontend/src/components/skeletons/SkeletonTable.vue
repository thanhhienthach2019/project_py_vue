<!-- src/components/skeletons/SkeletonTable.vue -->
<template>
  <div class="w-full overflow-hidden animate-pulse">
    <!-- Header skeleton -->
    <div class="grid mb-3 gap-x-4 gap-y-2" :style="gridStyle">
      <div
        v-for="n in columns"
        :key="`header-${n}`"
        class="h-8 rounded-lg bg-gradient-to-r from-gray-100 to-gray-75"
      />
    </div>

    <!-- Rows skeleton -->
    <div
      v-for="r in rows"
      :key="`row-${r}`"
      class="grid py-3 gap-x-4 gap-y-3 border-t border-gray-100"
      :style="gridStyle"
    >
      <div
        v-for="c in columns"
        :key="`cell-${r}-${c}`"
        class="flex items-center"
      >
        <div class="h-5 w-full rounded-md" :class="cellClass(c)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    rows?: number;
    columns?: number;
    variant?: "default" | "card";
  }>(),
  {
    rows: 5,
    columns: 5,
    variant: "default",
  }
);

// Tạo grid template columns động
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
}));

// Tuỳ biến cell cho các cột khác nhau
const cellClass = (index: number) => {
  const classes = ["bg-gradient-to-r from-gray-75 to-gray-50"];

  // Cột cuối có độ rộng khác (tuỳ use-case)
  if (index === props.columns && props.variant === "card") {
    classes.push("max-w-[80px]");
  }

  // Cột đầu tiên có indicator đặc biệt
  if (index === 1) {
    classes.push(
      "!bg-gray-100 pl-4 relative before:absolute before:left-0 before:inset-y-0 before:w-1 before:rounded-full before:bg-gray-200"
    );
  }

  return classes;
};
</script>

<style scoped>
/* Tối ưu hoá animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.bg-gradient-to-r {
  background-size: 200% 100%;
  animation: shimmer 1.8s linear infinite;
  background-image: linear-gradient(
    90deg,
    var(--gradient-from, #f5f5f5),
    #f0f0f0 40%,
    #f5f5f5 60%,
    var(--gradient-to, #f5f5f5)
  );
}
</style>
