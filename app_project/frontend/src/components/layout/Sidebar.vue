<template>
  <aside
    :class="[
      'w-64 bg-[#2E3A47] shadow-xl transition-all duration-300 border-r border-white/10 flex flex-col',
      props.sidebarOpen ? 'block' : 'hidden'
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
        <li>
          <RouterLink
            to="/"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
            active-class="bg-[#3B4856] text-blue-400"
          >
            <Icon icon="mdi:home" class="sidebar-icon group-hover:text-blue-400" />
            <span>Dashboard Overview</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/material"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
          >
            <Icon icon="mdi:archive" class="sidebar-icon group-hover:text-blue-400" />
            <span>Material Catalog</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/maintenance-requests"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
          >
            <Icon icon="mdi:clipboard-check" class="sidebar-icon group-hover:text-blue-400" />
            <span>Maintenance Requests</span>
          </RouterLink>
        </li>

        <li class="relative group">
          <RouterLink
            to="/stock-management"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
          >
            <Icon icon="mdi:warehouse" class="sidebar-icon group-hover:text-blue-400" />
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
                class="submenu-item group hover:bg-[#3B4856] hover:text-blue-400 rounded-t-lg"
              >
                <Icon icon="mdi:tray-arrow-down" class="submenu-icon group-hover:text-blue-400" />
                <span>IP Stock In</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/stock-management/ip-stock-out"
                class="submenu-item group hover:bg-[#3B4856] hover:text-blue-400"
              >
                <Icon icon="mdi:tray-arrow-up" class="submenu-icon group-hover:text-blue-400" />
                <span>IP Stock Out</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/stock-management/ip-stock-onhand"
                class="submenu-item group hover:bg-[#3B4856] hover:text-blue-400"
              >
                <Icon icon="mdi:clipboard-list" class="submenu-icon group-hover:text-blue-400" />
                <span>IP Stock On Hand</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/inventory-history"
                class="submenu-item group hover:bg-[#3B4856] hover:text-blue-400 rounded-b-lg"
              >
                <Icon icon="mdi:history" class="submenu-icon group-hover:text-blue-400" />
                <span>Transaction History</span>
              </RouterLink>
            </li>
          </ul>
        </li>

        <li>
          <RouterLink
            to="/machine"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
          >
            <Icon icon="mdi:robot-industrial" class="sidebar-icon group-hover:text-blue-400" />
            <span>Machine Operations</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import { defineProps } from 'vue';

const props = defineProps<{ sidebarOpen: boolean }>();
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-6 py-3 transition-colors duration-200 rounded-lg mx-2;
}
.sidebar-icon {
  @apply text-lg mr-3 text-blue-300;
}
.submenu-item {
  @apply flex items-center px-4 py-3 whitespace-nowrap text-gray-200 transition-colors duration-150;
}
.submenu-icon {
  @apply text-base mr-3 text-blue-300;
}
</style>
