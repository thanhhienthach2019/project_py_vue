<template>
  <header
    class="sticky top-0 z-50 bg-gradient-to-r from-amber-800 to-amber-900 shadow-lg"
  >
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="bg-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-8 h-8 fill-amber-600"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
          <span class="text-white text-xl font-bold tracking-wider"
            >ព្រះធម៌</span
          >
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-amber-100 hover:text-white transition-colors font-medium"
            active-class="text-white border-b-2 border-amber-300"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Search and User -->
        <div class="flex items-center space-x-4">
          <button class="text-amber-100 hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div class="hidden md:block w-px h-6 bg-amber-600"></div>

          <button
            class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            ចូល
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const navItems = [
  { name: "ព័ត៌មាន", path: "/news" },
  { name: "ពិធីបុណ្យ", path: "/festivals" },
  { name: "ព្រះធម៌", path: "/scriptures" },
  { name: "វីដេអូ", path: "/videos" },
  { name: "អ្នកឧបត្ថម្ភ", path: "/donors" },
  { name: "អំពីពួកយើង", path: "/about" },
];
</script>

<style scoped>
.router-link-active {
  @apply text-white border-b-2 border-amber-300;
}
</style>
