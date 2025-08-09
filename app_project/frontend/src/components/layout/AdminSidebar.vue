<template>
  <aside
    :class="[
      'fixed sm:static z-40 h-screen bg-[#2E3A47] shadow-xl transition-all duration-300 border-r border-white/10 flex flex-col',
      props.sidebarOpen ? 'w-64' : 'w-20',
      props.sidebarOpen ? 'left-0' : '-left-full sm:left-0',
    ]"
  >
    <!-- Header -->
    <div
      class="p-5 flex items-center space-x-3 border-b border-white/10"
      :class="{ 'justify-center': !props.sidebarOpen }"
    >
      <Icon icon="mdi:view-dashboard" class="text-blue-400 text-3xl" />
      <h1
        v-if="props.sidebarOpen"
        class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Admin Portal
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-6 flex-1 overflow-y-auto">
      <ul class="space-y-1 px-2">
        <!-- Dashboard -->
        <li>
          <RouterLink
            to="/admin"
            class="sidebar-item group"
            active-class="bg-[#3B4856] text-blue-400"
            :title="props.sidebarOpen ? '' : 'Dashboard Overview'"
          >
            <Icon icon="mdi:home" class="sidebar-icon" />
            <span v-if="props.sidebarOpen">Dashboard Overview</span>
          </RouterLink>
        </li>

        <!-- Slide -->
        <li>
          <RouterLink
            to="/admin/news/slide"
            class="sidebar-item group hover:bg-[#3B4856] hover:text-blue-400"
            active-class="bg-[#3B4856] text-blue-400"
            :title="props.sidebarOpen ? '' : 'Slide Manager'"
          >
            <Icon
              icon="mdi:slideshow"
              class="sidebar-icon group-hover:text-blue-400"
            />
            <span v-if="props.sidebarOpen">Slide Manager</span>
          </RouterLink>
        </li>

        <!-- Material -->
        <li>
          <RouterLink
            to="/admin/inventory/material"
            class="sidebar-item group"
            :title="props.sidebarOpen ? '' : 'Material Catalog'"
          >
            <Icon icon="mdi:archive" class="sidebar-icon" />
            <span v-if="props.sidebarOpen">Material Catalog</span>
          </RouterLink>
        </li>

        <!-- Maintenance -->
        <li>
          <RouterLink
            to="/admin/inventory/maintenance-requests"
            class="sidebar-item group"
            :title="props.sidebarOpen ? '' : 'Maintenance Requests'"
          >
            <Icon icon="mdi:clipboard-check" class="sidebar-icon" />
            <span v-if="props.sidebarOpen">Maintenance Requests</span>
          </RouterLink>
        </li>

        <!-- Stock & Inventory -->
        <li class="relative group">
          <div
            class="sidebar-item group cursor-pointer"
            :title="props.sidebarOpen ? '' : 'Stock & Inventory'"
            @click="toggleStockMenu"
          >
            <Icon icon="mdi:warehouse" class="sidebar-icon" />
            <span v-if="props.sidebarOpen">Stock & Inventory</span>
            <Icon
              v-if="props.sidebarOpen"
              icon="mdi:chevron-down"
              class="ml-auto text-sm text-blue-300 transition-transform duration-200"
              :class="{ 'rotate-180': stockMenuOpen }"
            />
          </div>
          <ul
            v-if="props.sidebarOpen && stockMenuOpen"
            class="ml-8 min-w-max bg-[#2E3A47] rounded-lg shadow-lg z-10"
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
          <RouterLink
            to="/admin/inventory/machine"
            class="sidebar-item group"
            :title="props.sidebarOpen ? '' : 'Machine Operations'"
          >
            <Icon icon="mdi:robot-industrial" class="sidebar-icon" />
            <span v-if="props.sidebarOpen">Machine Operations</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Collapse Button -->
    <div
      class="p-4 border-t border-white/10 flex justify-center"
      v-if="props.sidebarOpen"
    >
      <button
        @click="$emit('toggle')"
        class="p-2 rounded-lg bg-[#3B4856] hover:bg-[#475769] text-gray-300 hover:text-white transition-colors duration-200"
        title="Collapse sidebar"
      >
        <Icon icon="mdi:chevron-left" class="text-xl" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  sidebarOpen: boolean;
  isMobile?: boolean;
}>();

const emit = defineEmits(["toggle"]);

const stockMenuOpen = ref(false);

const toggleStockMenu = () => {
  if (!props.sidebarOpen) {
    emit("toggle");
    stockMenuOpen.value = true;
  } else {
    stockMenuOpen.value = !stockMenuOpen.value;
  }
};
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-4 py-3 transition-colors duration-200 rounded-lg text-gray-200 hover:bg-[#3B4856] hover:text-blue-400;
}
.sidebar-icon {
  @apply text-xl mr-3 text-blue-300 group-hover:text-blue-400;
}
.submenu-item {
  @apply flex items-center px-4 py-3 whitespace-nowrap text-gray-200 transition-colors duration-150 hover:bg-[#3B4856] hover:text-blue-400;
}
.submenu-icon {
  @apply text-base mr-3 text-blue-300 group-hover:text-blue-400;
}

/* Animation for sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
