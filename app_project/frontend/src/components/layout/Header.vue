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

    <!-- Right Section: User + Settings -->
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

        <div
          v-show="userDropdownOpen"
          class="absolute right-0 top-full mt-2 w-52 bg-[#2F3A48] rounded-xl shadow-2xl border border-white/10 z-50 transition-all duration-200 origin-top-right"
        >
          <ul class="py-2">
            <li>
              <button
                class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400"
              >
                <Icon
                  icon="mdi:account-circle-outline"
                  class="text-lg mr-3 text-blue-300"
                />
                My Profile
              </button>
            </li>
            <li>
              <button
                class="w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400"
              >
                <Icon
                  icon="mdi:lock-reset"
                  class="text-lg mr-3 text-blue-300"
                />
                Change Password
              </button>
            </li>
            <li>
              <button
                @click="logout"
                class="w-full flex items-center px-5 py-3 text-sm text-red-400 hover:bg-red-600/10 hover:text-white"
              >
                <Icon icon="mdi:logout" class="text-lg mr-3 text-red-300" />
                Logout
              </button>
            </li>
          </ul>
        </div>
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

        <div
          v-show="settingsDropdownOpen"
          class="absolute right-0 top-full mt-2 w-60 bg-[#2F3A48] rounded-xl shadow-2xl border border-white/10 z-50 transition-all duration-200 origin-top-right"
        >
          <ul class="py-2">
            <li>
              <button @click="navigateTo('/settings/forms')" class="menu-item">
                <Icon icon="mdi:form-select" class="icon" />
                Manager Form Access
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('/settings/policies')"
                class="menu-item"
              >
                <Icon icon="mdi:shield-key-outline" class="icon" />
                Setup Policy
              </button>
            </li>
            <li>
              <button @click="navigateTo('/settings/roles')" class="menu-item">
                <Icon icon="mdi:account-group-outline" class="icon" />
                Manage Roles
              </button>
            </li>
            <li>
              <button @click="navigateTo('/settings/users')" class="menu-item">
                <Icon icon="mdi:account-outline" class="icon" />
                Manage Users
              </button>
            </li>
            <li>
              <button @click="navigateTo('/settings/menus')" class="menu-item">
                <Icon icon="mdi:menu" class="icon" />
                Menu Management
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('/settings/routers')"
                class="menu-item"
              >
                <Icon icon="mdi-router" class="icon" />
                Router Permission
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useAuth } from "@/hooks/useAuth";

const authStore = useAuthStore();
const router = useRouter();
const { user } = useAuth();

// Dropdown states
const userDropdownOpen = ref(false);
const settingsDropdownOpen = ref(false);
let userTimeout: ReturnType<typeof setTimeout> | null = null;
let settingsTimeout: ReturnType<typeof setTimeout> | null = null;

const username = computed(() => user.value?.username ?? "User");

function logout() {
  authStore.logout();
}

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

function navigateTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
.menu-item {
  @apply w-full flex items-center px-5 py-3 text-sm text-gray-100 hover:bg-[#3B4856] hover:text-blue-400 transition duration-150;
}
.icon {
  @apply text-lg mr-3 text-blue-300;
}
</style>
