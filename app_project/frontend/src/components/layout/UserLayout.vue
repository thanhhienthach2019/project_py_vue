<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
  >
    <!-- Header -->
    <UserHeader @toggle-sidebar="toggleSidebar" class="z-50" />

    <!-- Main layout with sidebar and main content -->
    <div class="flex flex-1 pt-16">
      <!-- Overlay for mobile sidebar -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/60 dark:bg-black/80 lg:hidden transition-opacity duration-300 ease-in-out"
        :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar -->
      <UserSidebar
        ref="sidebar"
        class="hidden lg:block z-40 w-64 transition-transform duration-500 ease-in-out"
        :class="{ 'z-50': isSidebarOpen }"
      />

      <!-- Main Content -->
      <UserMainContent class="flex-1 px-4">
        <router-view />
      </UserMainContent>

      <UserRightPanel
        class="hidden lg:block w-64 border-l border-gray-200 dark:border-gray-700"
      />
    </div>

    <!-- Footer -->
    <UserFooter />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import UserHeader from "@/components/layout/UserHeader.vue";
import UserSidebar from "@/components/layout/UserSidebar.vue";
import UserMainContent from "@/components/layout/UserMainContent.vue";
import UserFooter from "@/components/layout/UserFooter.vue";
import UserRightPanel from "@/components/layout/UserRightPanel.vue";

const sidebar = ref(null);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  if (sidebar.value) {
    sidebar.value.toggleSidebar();
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const isOpen = computed(() => sidebar.value?.isOpen || false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
