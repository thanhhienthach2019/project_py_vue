<template>
  <aside
    class="hidden lg:flex lg:flex-col bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 h-screen pt-16 fixed right-0 top-16 lg:w-2/12 shadow-lg z-30 transition-colors duration-500"
  >
    <div class="flex-1 px-6 py-6 space-y-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Nội dung nổi bật
      </h3>
      <div class="space-y-4">
        <div
          class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">
            Sự kiện sắp tới
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Lễ hội Văn hóa Khmer 2025 - 20/07/2025
          </p>
        </div>
        <div
          class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">
            Tin tức mới
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Cộng đồng Khmer tổ chức quyên góp từ thiện
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
