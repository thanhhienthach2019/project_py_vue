<template>
  <div
    class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-500"
  >
    <!-- Animated Gradient Background -->
    <div
      class="absolute -top-8 -left-8 w-32 h-32 bg-gradient-radial from-pink-300 to-transparent opacity-40 dark:from-pink-700 rounded-full animate-blob"
    ></div>

    <!-- Media Image with Overlay -->
    <div class="relative overflow-hidden h-60">
      <img
        :src="image"
        alt="media"
        class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </div>

    <!-- Content -->
    <div class="p-6 z-10">
      <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h4>
      <p
        class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed"
      >
        {{ description }}
      </p>
      <RouterLink
        :to="link"
        class="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
      >
        <span>Explore</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

// Props definition
defineProps<{
  title: string;
  description: string;
  image: string;
  link: string;
}>();
</script>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(10px, -10px) scale(1.1);
  }
  66% {
    transform: translate(-10px, 10px) scale(0.9);
  }
}
.animate-blob {
  animation: blob 8s infinite ease-in-out;
}
.bg-gradient-radial {
  background-image: radial-gradient(circle at center, var(--tw-gradient-stops));
}

/* Clamp text to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  line-clamp: 3;
}
</style>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition;
}
.btn-secondary {
  @apply bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full text-lg hover:bg-blue-50 transition;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
