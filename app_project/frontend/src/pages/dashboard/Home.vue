<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const authStore = useAuthStore();
const router = useRouter();

const sidebarOpen = ref(true);

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="flex min-h-screen bg-[#1E2A38] text-[#E0E0E0]">
    <!-- Sidebar -->
    <aside
      :class="[
        'w-64 bg-[#2E3A47] shadow-xl transition-all duration-300',
        sidebarOpen ? 'block' : 'hidden',
      ]"
    >
      <div class="p-5 flex items-center space-x-3 border-b border-gray-600">
        <Icon icon="mdi:view-dashboard" class="text-blue-400 text-3xl" />
        <h1 class="text-xl font-bold">Dashboard</h1>
      </div>
      <nav class="mt-6">
        <RouterLink
          to="/"
          class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
        >
          <Icon icon="mdi:home" class="text-lg mr-3 text-blue-300" />
          Trang chủ
        </RouterLink>
        <RouterLink
          to="/material"
          class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
        >
          <Icon icon="mdi:folder" class="text-lg mr-3 text-blue-300" />
          Danh mục vật tư
        </RouterLink>
        <RouterLink
          to="/request-form"
          class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
        >
          <Icon icon="mdi:clipboard-text" class="text-lg mr-3 text-blue-300" />
          Phiếu yêu cầu
        </RouterLink>
        <RouterLink
          to="/stock-management"
          class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
        >
          <Icon icon="mdi:truck-delivery" class="text-lg mr-3 text-blue-300" />
          Nhập - Xuất kho
        </RouterLink>
        <RouterLink
          to="/inventory-history"
          class="flex items-center px-6 py-3 hover:bg-[#3B4856] hover:text-blue-400 transition rounded-lg"
        >
          <Icon icon="mdi:history" class="text-lg mr-3 text-blue-300" />
          Lịch sử kho
        </RouterLink>
      </nav>
      <button
        @click="logout"
        class="mt-auto flex items-center px-6 py-3 text-red-400 hover:bg-red-600 hover:text-white transition w-full rounded-lg"
      >
        <Icon icon="mdi:logout" class="text-lg mr-3" />
        Đăng xuất
      </button>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Navbar -->
      <header class="bg-[#2E3A47] p-4 flex items-center justify-between shadow-md">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-300 hover:text-white">
          <Icon icon="mdi:menu" class="text-2xl" />
        </button>
        <h2 class="text-lg font-semibold">Bảng điều khiển</h2>
        <div class="flex items-center space-x-3">
          <Icon icon="mdi:bell" class="text-2xl text-gray-400 hover:text-white cursor-pointer" />
          <Icon icon="mdi:account-circle" class="text-2xl text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </header>

      <!-- Nội dung động từ Vue Router -->
      <main class="main p-6 flex-grow bg-[#252F3D] rounded-lg shadow-lg">
        <RouterView />
      </main>

      <!-- Footer cố định dưới -->
      <footer class="bg-[#2E3A47] p-4 text-center text-gray-400 text-sm mt-auto shadow-md">
        © 2024 Công ty TNHH . Mọi quyền được bảo lưu.
      </footer>
    </div>
  </div>
</template>
