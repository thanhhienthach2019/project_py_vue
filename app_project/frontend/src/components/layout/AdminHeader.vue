<template>
  <header
    class="bg-[#2E3A47] p-4 flex items-center justify-between shadow-md border-b border-white/10"
  >
    <!-- Toggle Sidebar -->
    <button
      @click="$emit('toggleSidebar')"
      class="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
    >
      <Icon icon="mdi:menu" class="text-2xl" />
    </button>

    <!-- Title -->
    <h2 class="text-lg font-semibold text-gray-200 hidden md:block">
      Dashboard
    </h2>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- User Dropdown -->
      <div
        class="relative"
        @mouseenter="showUserDropdown"
        @mouseleave="hideUserDropdown"
      >
        <div
          class="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <div
            class="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30"
          >
            <Icon icon="mdi:account" class="text-blue-400" />
          </div>
          <span class="text-sm font-medium text-gray-200">{{ username }}</span>
          <Icon icon="mdi:chevron-down" class="text-gray-400 text-sm" />
        </div>

        <Transition name="fade">
          <div
            v-if="userDropdownOpen"
            class="absolute right-0 top-full mt-2 w-52 bg-[#2F3A48] rounded-xl shadow-2xl border border-white/10 z-50 origin-top-right"
          >
            <ul class="py-2">
              <li>
                <button class="menu-item">
                  <Icon icon="mdi:account-circle-outline" class="icon" />
                  My Profile
                </button>
              </li>
              <li>
                <button class="menu-item">
                  <Icon icon="mdi:lock-reset" class="icon" />
                  Change Password
                </button>
              </li>
              <li>
                <button @click="logout" class="menu-item-danger">
                  <Icon icon="mdi:logout" class="icon-danger" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      <!-- Settings Dropdown -->
      <div
        class="relative"
        @mouseenter="showSettingsDropdown"
        @mouseleave="hideSettingsDropdown"
      >
        <button
          class="p-2 rounded-full bg-[#2E3A47] hover:bg-[#3B4856] text-gray-300 hover:text-blue-400 transition-colors duration-200"
        >
          <Icon icon="mdi:cog-outline" class="text-2xl" />
        </button>

        <Transition name="fade">
          <div
            v-if="settingsDropdownOpen"
            class="absolute right-0 top-full mt-2 w-60 bg-[#2F3A48] rounded-xl shadow-2xl border border-white/10 z-50 origin-top-right"
          >
            <ul class="py-2">
              <li v-for="item in settingsMenu" :key="item.path">
                <button @click="navigateTo(item.path)" class="menu-item">
                  <Icon :icon="item.icon" class="icon" />
                  {{ item.label }}
                </button>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuth } from "@/hooks/auth/useAuth";

const authStore = useAuthStore();
const router = useRouter();
const { user } = useAuth();

const username = computed(() => user.value?.username ?? "User");

// Dropdown logic
const userDropdownOpen = ref(false);
const settingsDropdownOpen = ref(false);
let userTimeout: ReturnType<typeof setTimeout> | null = null;
let settingsTimeout: ReturnType<typeof setTimeout> | null = null;

function showUserDropdown() {
  if (userTimeout) clearTimeout(userTimeout);
  userDropdownOpen.value = true;
}
function hideUserDropdown() {
  userTimeout = setTimeout(() => {
    userDropdownOpen.value = false;
  }, 200);
}
function showSettingsDropdown() {
  if (settingsTimeout) clearTimeout(settingsTimeout);
  settingsDropdownOpen.value = true;
}
function hideSettingsDropdown() {
  settingsTimeout = setTimeout(() => {
    settingsDropdownOpen.value = false;
  }, 200);
}
onBeforeUnmount(() => {
  if (userTimeout) clearTimeout(userTimeout);
  if (settingsTimeout) clearTimeout(settingsTimeout);
});

function navigateTo(path: string) {
  router.push(path);
}
function logout() {
  authStore.logout();
}

const settingsMenu = [
  {
    icon: "mdi:form-select",
    label: "Manager Form Access",
    path: "settings/forms",
  },
  {
    icon: "mdi:shield-key-outline",
    label: "Setup Policy",
    path: "settings/policies",
  },
  {
    icon: "mdi:account-group-outline",
    label: "Manage Roles",
    path: "settings/roles",
  },
  {
    icon: "mdi:account-outline",
    label: "Manage Users",
    path: "settings/users",
  },
  { icon: "mdi:menu", label: "Menu Management", path: "settings/menus" },
  { icon: "mdi:router", label: "Router Permission", path: "settings/routers" },
].map((item) => ({
  ...item,
  path: `/admin/${item.path}`,
}));
</script>

<style scoped>
.menu-item {
  @apply w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150;
}
.menu-item-danger {
  @apply w-full flex items-center px-5 py-3 text-sm text-red-400 hover:bg-red-600/10 hover:text-white transition duration-150;
}
.icon {
  @apply text-lg mr-3 text-blue-300;
}
.icon-danger {
  @apply text-lg mr-3 text-red-300;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
