<template>
  <aside
    :class="[
      'w-64 bg-[#2E3A47] shadow-xl transition-all duration-300 border-r border-white/10 flex flex-col',
      props.sidebarOpen ? 'block' : 'hidden',
    ]"
  >
    <!-- Header -->
    <div class="p-5 flex items-center space-x-3 border-b border-white/10">
      <Icon icon="mdi:view-dashboard" class="text-blue-400 text-3xl" />
      <h1
        class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Admin Portal
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-6 flex-1 overflow-y-auto">
      <ul class="space-y-1">
        <!-- Dashboard -->
        <li>
          <RouterLink
            to="/admin"
            class="sidebar-item group"
            active-class="bg-[#3B4856] text-blue-400"
          >
            <Icon icon="mdi:home" class="sidebar-icon" />
            <span>Dashboard Overview</span>
          </RouterLink>
        </li>

        <!-- Material -->
        <li>
          <RouterLink to="/admin/inventory/material" class="sidebar-item group">
            <Icon icon="mdi:archive" class="sidebar-icon" />
            <span>Material Catalog</span>
          </RouterLink>
        </li>

        <!-- Maintenance -->
        <li>
          <RouterLink
            to="/admin/inventory/maintenance-requests"
            class="sidebar-item group"
          >
            <Icon icon="mdi:clipboard-check" class="sidebar-icon" />
            <span>Maintenance Requests</span>
          </RouterLink>
        </li>

        <!-- Stock & Inventory -->
        <li class="relative group">
          <div class="sidebar-item group cursor-pointer">
            <Icon icon="mdi:warehouse" class="sidebar-icon" />
            <span>Stock & Inventory</span>
            <Icon
              icon="mdi:chevron-down"
              class="ml-auto text-sm text-blue-300"
            />
          </div>
          <ul
            class="absolute left-0 top-full mt-0 ml-8 min-w-max bg-[#2E3A47] rounded-lg shadow-lg opacity-0 invisible scale-y-0 origin-top group-hover:opacity-100 group-hover:visible group-hover:scale-y-100 transform transition-all duration-200 z-10"
          >
            <li>
              <RouterLink
                to="/admin/stock-management/ip-stock-in"
                class="submenu-item group"
              >
                <Icon icon="mdi:tray-arrow-down" class="submenu-icon" />
                <span>IP Stock In</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/stock-management/ip-stock-out"
                class="submenu-item group"
              >
                <Icon icon="mdi:tray-arrow-up" class="submenu-icon" />
                <span>IP Stock Out</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/stock-management/ip-stock-onhand"
                class="submenu-item group"
              >
                <Icon icon="mdi:clipboard-list" class="submenu-icon" />
                <span>IP Stock On Hand</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/inventory/history"
                class="submenu-item group rounded-b-lg"
              >
                <Icon icon="mdi:history" class="submenu-icon" />
                <span>Transaction History</span>
              </RouterLink>
            </li>
          </ul>
        </li>

        <!-- Machine -->
        <li>
          <RouterLink to="/admin/inventory/machine" class="sidebar-item group">
            <Icon icon="mdi:robot-industrial" class="sidebar-icon" />
            <span>Machine Operations</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

const props = defineProps<{ sidebarOpen: boolean }>();
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-6 py-3 transition-colors duration-200 rounded-lg mx-2 text-gray-200 hover:bg-[#3B4856] hover:text-blue-400;
}
.sidebar-icon {
  @apply text-lg mr-3 text-blue-300 group-hover:text-blue-400;
}
.submenu-item {
  @apply flex items-center px-4 py-3 whitespace-nowrap text-gray-200 transition-colors duration-150 hover:bg-[#3B4856] hover:text-blue-400;
}
.submenu-icon {
  @apply text-base mr-3 text-blue-300 group-hover:text-blue-400;
}
</style>
