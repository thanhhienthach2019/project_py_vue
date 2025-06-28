<template>
  <div class="flex min-h-screen bg-[#1E2A38] text-[#E0E0E0]">
    <!-- Sidebar -->
    <aside
      :class="[
        'w-64 bg-[#2E3A47] shadow-xl transition-all duration-300 border-r border-white/10 flex flex-col',
        sidebarOpen ? 'block' : 'hidden'
      ]"
    >
      <div class="p-5 flex items-center space-x-3 border-b border-white/10">
        <Icon icon="mdi:view-dashboard" class="text-blue-400 text-3xl" />
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Portal
        </h1>
      </div>

      <nav class="mt-6 flex-1 overflow-y-auto">
        <ul class="space-y-1">
          <!-- Dashboard Overview -->
          <li>
            <RouterLink
              to="/"
              class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-200 rounded-lg mx-2 group"
              active-class="bg-[#3B4856] text-blue-400"
            >
              <Icon icon="mdi:home" class="text-lg mr-3 text-blue-300 group-hover:text-blue-400" />
              <span>Dashboard Overview</span>
            </RouterLink>
          </li>

          <!-- Material Catalog -->
          <li>
            <RouterLink
              to="/material"
              class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-200 rounded-lg mx-2 group"
            >
              <Icon icon="mdi:archive" class="text-lg mr-3 text-blue-300 group-hover:text-blue-400" />
              <span>Material Catalog</span>
            </RouterLink>
          </li>

          <!-- Maintenance Requests -->
          <li>
            <RouterLink
              to="/maintenance-requests"
              class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-200 rounded-lg mx-2 group"
            >
              <Icon icon="mdi:clipboard-check" class="text-lg mr-3 text-blue-300 group-hover:text-blue-400" />
              <span>Maintenance Requests</span>
            </RouterLink>
          </li>

          <!-- Stock & Inventory (có submenu) -->
          <li class="relative group">
            <!-- RouterLink chính -->
            <RouterLink
              to="/stock-management"
              class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-200 rounded-lg mx-2 group"
            >
              <Icon icon="mdi:warehouse" class="text-lg mr-3 text-blue-300 group-hover:text-blue-400" />
              <span>Stock & Inventory</span>
              <Icon icon="mdi:chevron-down" class="ml-auto text-sm text-blue-300 group-hover:text-blue-400" />
            </RouterLink>
            <ul
              class="absolute left-0 top-full mt-0 ml-8 min-w-max bg-[#2E3A47] rounded-lg shadow-lg
                    opacity-0 invisible scale-y-0 origin-top
                    group-hover:opacity-100 group-hover:visible group-hover:scale-y-100
                    transform transition-all duration-200 z-10"
            >
              <li>
                <RouterLink
                  to="/stock-management/ip-stock-in"
                  class="flex items-center px-4 py-3 whitespace-nowrap text-gray-200 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-150 rounded-t-lg"
                >
                  <Icon icon="mdi:tray-arrow-down" class="text-base mr-3 text-blue-300 group-hover:text-blue-400" />
                  <span>IP Stock In</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/stock-management/ip-stock-out"
                  class="flex items-center px-4 py-3 whitespace-nowrap text-gray-200 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-150"
                >
                  <Icon icon="mdi:tray-arrow-up" class="text-base mr-3 text-blue-300 group-hover:text-blue-400" />
                  <span>IP Stock Out</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/stock-management/ip-stock-onhand"
                  class="flex items-center px-4 py-3 whitespace-nowrap text-gray-200 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-150"
                >
                  <Icon icon="mdi:clipboard-list" class="text-base mr-3 text-blue-300 group-hover:text-blue-400" />
                  <span>IP Stock On Hand</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/inventory-history"
                  class="flex items-center px-4 py-3 whitespace-nowrap text-gray-200 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-150 rounded-b-lg"
                >
                  <Icon icon="mdi:history" class="text-base mr-3 text-blue-300 group-hover:text-blue-400" />
                  <span>Transaction History</span>
                </RouterLink>
              </li>
            </ul>
          </li>

          <!-- Machine Operations -->
          <li>
            <RouterLink
              to="/machine"
              class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition-colors duration-200 rounded-lg mx-2 group"
            >
              <Icon icon="mdi:robot-industrial" class="text-lg mr-3 text-blue-300 group-hover:text-blue-400" />
              <span>Machine Operations</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <button
        @click="logout"
        class="mt-auto mx-2 mb-4 flex items-center px-6 py-3 text-red-400 hover:bg-red-600/20 hover:text-white transition-colors duration-200 rounded-lg border border-transparent hover:border-red-600/30"
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
          class="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
        >
          <Icon icon="mdi:menu" class="text-2xl" />
        </button>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 relative">
              <Icon icon="mdi:bell" class="text-2xl text-gray-400 hover:text-white" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <div class="flex items-center space-x-2 group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30">
              <Icon icon="mdi:account" class="text-blue-400" />
            </div>
            <span class="text-sm font-medium group-hover:text-blue-400 transition-colors duration-200">Admin</span>
          </div>
          <!-- Settings Dropdown - Professional UI -->
          <div class="relative" @mouseenter="showDropdown" @mouseleave="hideDropdown">
            <!-- Icon -->
            <button
              class="p-2 rounded-full bg-[#2E3A47] hover:bg-[#3B4856] text-gray-300 hover:text-blue-400 transition-colors duration-200"
            >
              <Icon icon="mdi:cog-outline" class="text-2xl" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-show="dropdownOpen"
              class="absolute right-0 top-full mt-2 w-60 bg-[#2F3A48] rounded-xl shadow-2xl border border-white/10 z-50
                    transition-all duration-200 origin-top-right"
            >
              <ul class="py-2">
                <li>
                  <button
                    @click="navigateTo('/settings/policies')"
                    class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150"
                  >
                    <Icon icon="mdi:shield-key-outline" class="text-lg mr-3 text-blue-300" />
                    Setup Policy
                  </button>
                </li>
                <li>
                  <button
                    @click="navigateTo('/settings/roles')"
                    class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150"
                  >
                    <Icon icon="mdi:account-group-outline" class="text-lg mr-3 text-blue-300" />
                    Manage Roles
                  </button>
                </li>
                <li>
                  <button
                    @click="router.push('/settings/users')"
                    class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150"
                  >
                    <Icon icon="mdi:account-outline" class="text-lg mr-3 text-blue-300" />
                    Manage Users
                  </button>
                </li>
                <li>
                  <button
                    @click="router.push('/settings/menus')"
                    class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150"
                  >
                    <Icon icon="mdi:menu" class="text-lg mr-3 text-blue-300" />
                    Menu Management
                  </button>
                </li>
              </ul>
            </div>
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
const dropdownOpen = ref(false);
let closeTimeout: ReturnType<typeof setTimeout> | null = null;
const sidebarOpen = ref(true);

function logout() {
  authStore.logout();
  router.push('/login');
}
const showDropdown = () => {
  if (closeTimeout) clearTimeout(closeTimeout);
  dropdownOpen.value = true;
};

const hideDropdown = () => {
  closeTimeout = setTimeout(() => {
    dropdownOpen.value = false;
  }, 200); // Delay 200ms cho cảm giác mượt
};

const navigateTo = (path: string) => {
  dropdownOpen.value = false;
  router.push(path);
};
</script>
