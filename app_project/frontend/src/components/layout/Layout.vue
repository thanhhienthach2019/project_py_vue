<template>
    <div class="flex min-h-screen bg-[#1E2A38] text-[#E0E0E0]">
      <!-- Sidebar -->
      <aside
        :class="[
          'w-64 bg-[#2E3A47] shadow-xl transition-all duration-300 border-r border-white/10',
          sidebarOpen ? 'block' : 'hidden'
        ]"
      >
        <div class="p-5 flex items-center space-x-3 border-b border-white/10">
          <Icon icon="mdi:view-dashboard" class="text-blue-400 text-3xl" />
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <nav class="mt-6 space-y-1">
          <RouterLink
            to="/"
            class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg mx-2 group"
            active-class="bg-[#3B4856] text-blue-400"
          >
            <Icon icon="mdi:home" class="text-lg mr-3 text-blue-300 group-[.active]:text-blue-400" />
            <span>Home</span>
          </RouterLink>
          <RouterLink
            to="/material"
            class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
          >
            <Icon icon="mdi:folder" class="text-lg mr-3 text-blue-300" />
            Material Catalog
          </RouterLink>
          <RouterLink
            to="/request-form"
            class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
          >
            <Icon icon="mdi:clipboard-text" class="text-lg mr-3 text-blue-300" />
            Request Form
          </RouterLink>
          <RouterLink
            to="/stock-management"
            class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
          >
            <Icon icon="mdi:truck-delivery" class="text-lg mr-3 text-blue-300" />
            Stock Management
          </RouterLink>
          <RouterLink
            to="/inventory-history"
            class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
          >
            <Icon icon="mdi:history" class="text-lg mr-3 text-blue-300" />
            Inventory History
          </RouterLink>
        </nav>
        <button
          @click="logout"
          class="mt-auto mx-2 mb-4 flex items-center px-6 py-3 text-red-400 hover:bg-red-600/20 hover:text-white transition rounded-lg border border-transparent hover:border-red-600/30"
        >
          <Icon icon="mdi:logout" class="text-lg mr-3" />
          <span>Logout</span>
        </button>
      </aside>
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Navbar -->
        <header class="bg-[#2E3A47] p-4 flex items-center justify-between shadow-md border-b border-white/10">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <Icon icon="mdi:menu" class="text-2xl" />
          </button>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button class="p-2 rounded-lg hover:bg-white/10 transition relative">
                <Icon icon="mdi:bell" class="text-2xl text-gray-400 hover:text-white" />
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div class="flex items-center space-x-2 group cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30">
                <Icon icon="mdi:account" class="text-blue-400" />
              </div>
              <span class="text-sm font-medium group-hover:text-blue-400 transition">Admin</span>
            </div>
          </div>
        </header>
  
        <!-- Nội dung theo route -->
        <main class="flex-grow bg-gradient-to-br from-[#1E2A38] to-[#252F3D] p-6">
          <router-view />
        </main>
  
        <!-- Footer -->
        <footer class="bg-[#2E3A47] p-4 text-center text-gray-400 text-sm mt-auto shadow-md border-t border-white/10">
          © 2025 Company LLC. All rights reserved.
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/store/auth';
  import { useRouter, RouterLink } from 'vue-router';
  import { Icon } from '@iconify/vue';
  
  const authStore = useAuthStore();
  const router = useRouter();
  const sidebarOpen = ref(true);
  
  function logout() {
    authStore.logout();
    router.push('/login');
  }
  </script>
  