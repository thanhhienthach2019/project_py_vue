<template>
  <header
    class="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-lg transition-all duration-300"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
    >
      <!-- Logo & Mobile Toggle -->
      <div class="flex items-center">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            v-if="!isOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <router-link
          to="/"
          class="flex items-center px-6 py-3 lg:py-0 text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="@/assets/logo1.jpg"
            alt="Logo"
            class="h-10 w-10 transform hover:rotate-12 transition-transform duration-500"
          />
          <span
            class="ml-2 text-2xl font-bold font-['Poppins'] bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
          >
            Chùa Khmer
          </span>
        </router-link>
      </div>

      <!-- Nav Links -->
      <nav
        :class="[
          'flex-col lg:flex-row lg:flex lg:items-center lg:space-x-6 transition-all duration-300',
          isOpen
            ? 'flex opacity-100'
            : 'hidden opacity-0 lg:opacity-100 lg:flex',
        ]"
      >
        <router-link
          v-for="link in links"
          :key="link.text"
          :to="link.to"
          class="block px-6 py-3 lg:py-0 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:scale-105 transition-transform duration-200"
        >
          {{ link.text }}
        </router-link>
      </nav>

      <!-- Search & Profile -->
      <div class="hidden lg:flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="debouncedQuery"
            type="text"
            placeholder="Tìm kiếm..."
            class="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 text-sm"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
          />
          <Icon
            icon="mdi:magnify"
            class="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
          <div
            v-if="showSuggestions && debouncedQuery"
            class="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl py-2 z-50 transition-opacity duration-200"
          >
            <div
              v-for="suggestion in filteredSuggestions"
              :key="suggestion"
              class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>

        <div class="relative" @click="avatarOpen = !avatarOpen">
          <img
            src="@/assets/avatar.png"
            alt="User"
            class="h-9 w-9 rounded-full ring-2 ring-indigo-500 dark:ring-indigo-700 cursor-pointer hover:scale-110 transition-transform duration-300"
          />
          <span
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >2</span
          >
          <div
            v-if="avatarOpen"
            class="absolute right-0 mt-2 w-48 Ago white dark:bg-gray-900 rounded-lg shadow-xl py-2 z-50"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >Profile</router-link
            >
            <router-link
              to="/settings"
              class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >Settings</router-link
            >
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const isOpen = ref(false);
const avatarOpen = ref(false);
const query = ref("");
const debouncedQuery = ref("");
const router = useRouter();
const showSuggestions = ref(false);

const suggestions = [
  "Tin tức mới nhất",
  "Sự kiện sắp tới",
  "Kinh sách Phật giáo",
  "Thư viện hình ảnh",
  "Nhà hảo tâm",
];

const filteredSuggestions = computed(() =>
  suggestions.filter((s) =>
    s.toLowerCase().includes(debouncedQuery.value.toLowerCase())
  )
);

const links = [
  { text: "Trang chủ", to: "/" },
  { text: "Tin tức", to: "/news" },
  { text: "Sự kiện", to: "/festivals" },
  { text: "Thư viện", to: "/gallery" },
  { text: "Liên hệ", to: "/contact" },
];

defineEmits(["toggle-sidebar"]);

// Debounce search input
watch(query, (newValue) => {
  const timeout = setTimeout(() => {
    debouncedQuery.value = newValue;
  }, 300);
  return () => clearTimeout(timeout);
});

function hideSuggestions() {
  setTimeout(() => (showSuggestions.value = false), 200);
}

function logout() {
  router.push("/login");
}
</script>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(10px, -10px) scale(1.1);
  }
  66% {
    transform: translate(-10px, 10px) scale(0.9);
  }
}
.animate-blob {
  animation: blob 8s infinite ease-in-out;
}
</style>
