<template>
  <div class="flex min-h-screen bg-[#1E2A38] text-[#E0E0E0]">
    <!-- Sidebar -->
    <Sidebar
      :sidebarOpen="sidebarOpen"
      :isMobile="isMobile"
      @toggle="sidebarOpen = !sidebarOpen"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Navbar -->
      <HeaderComponent
        @toggleSidebar="toggleSidebar"
        :sidebarOpen="sidebarOpen"
      />

      <!-- Main content -->
      <MainContent />

      <!-- Footer -->
      <footer
        class="bg-[#2E3A47] p-4 text-center text-gray-400 text-sm mt-auto shadow-md border-t border-white/10"
      >
        © 2025 Company LLC. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import HeaderComponent from "@/components/layout/AdminHeader.vue";
import Sidebar from "@/components/layout/AdminSidebar.vue";
import MainContent from "@/components/layout/AdminMainContent.vue";

const sidebarOpen = ref(true);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>
