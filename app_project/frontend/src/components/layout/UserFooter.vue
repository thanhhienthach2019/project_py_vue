<template>
  <footer
    class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 transition-colors duration-500"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center"
    >
      <div class="text-center md:text-left mb-4 md:mb-0">
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          © 2025 Chùa Khmer. All rights reserved.
        </p>
      </div>
      <div class="flex space-x-6">
        <router-link
          to="/contact"
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 text-sm"
        >
          <Icon icon="mdi:email" class="w-5 h-5 mr-2" />
          Liên hệ
        </router-link>
        <router-link
          to="/about"
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 text-sm"
        >
          <Icon icon="mdi:information" class="w-5 h-5 mr-2" />
          Giới thiệu
        </router-link>
        <a
          href="https://facebook.com"
          target="_blank"
          class="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300"
        >
          <Icon icon="mdi:facebook" class="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
