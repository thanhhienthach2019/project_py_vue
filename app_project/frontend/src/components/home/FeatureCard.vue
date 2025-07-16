<template>
  <div
    class="group relative flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-slate-900 shadow-2xl hover:shadow-2xl/50 transition-transform duration-500 transform hover:-translate-y-2"
  >
    <!-- Decorative gradient blob -->
    <div
      class="absolute -top-6 -left-6 w-24 h-24 bg-gradient-radial from-blue-200 to-transparent opacity-40 dark:from-blue-900 dark:opacity-20 rounded-full animate-blob"
    ></div>

    <!-- Icon wrapper -->
    <div
      class="z-10 flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 transition-colors duration-500 group-hover:bg-blue-200"
    >
      <component
        :is="icon"
        class="w-8 h-8 text-blue-600 dark:text-blue-300 transition-colors duration-500 group-hover:text-blue-700"
      />
    </div>

    <!-- Content -->
    <h3
      class="z-10 mt-4 text-xl font-bold text-gray-900 dark:text-white text-center"
    >
      {{ title }}
    </h3>
    <p
      class="z-10 mt-2 text-gray-600 dark:text-gray-300 text-center leading-relaxed"
    >
      {{ description }}
    </p>

    <!-- Call to action -->
    <RouterLink
      :to="link"
      class="z-10 mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
    >
      <span>Xem thêm</span>
      <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M12.293 9.293a1 1 0 011.414 1.414L10.414 14H16a1 1 0 110 2H8a1 1 0 01-1-1V8a1 1 0 112 0v5.586l3.293-3.293z"
        />
      </svg>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  title: string;
  description: string;
  icon: any;
  link: string;
}>();
</script>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: scale(1) translate(0, 0);
  }
  33% {
    transform: scale(1.1) translate(5px, -5px);
  }
  66% {
    transform: scale(0.9) translate(-5px, 5px);
  }
}
.animate-blob {
  animation: blob 8s ease-in-out infinite;
}
.bg-gradient-radial {
  background-image: radial-gradient(circle at center, var(--tw-gradient-stops));
}
</style>
