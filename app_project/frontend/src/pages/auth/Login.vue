<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/vue";

const authHooks = useAuth();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await authHooks.login(username.value, password.value);
  } catch (error) {
    // errorMessage.value = error instanceof Error ? error.message : "Đăng nhập thất bại!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-blue-900">
    <div class="relative w-full max-w-md p-8 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg">
      <div class="text-center">
        <Icon icon="mdi:account-circle" class="text-blue-400 text-6xl mx-auto mb-3" />
        <h2 class="text-3xl font-bold text-gray-100">Đăng nhập</h2>        
      </div>

      <form @submit.prevent="handleLogin" class="mt-6">
        <div class="mb-4 relative">
          <Icon icon="mdi:account" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            id="username"
            v-model="username"
            type="text"
            class="w-full pl-10 pr-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Tên đăng nhập"
            required
          />
        </div>

        <div class="mb-4 relative">
          <Icon icon="mdi:lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            id="password"
            v-model="password"
            type="password"
            class="w-full pl-10 pr-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <p v-if="errorMessage" class="text-red-400 text-sm text-center mt-2">{{ errorMessage }}</p>

        <button 
          type="submit"
          class="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
          :disabled="loading"
        >
          <span v-if="loading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <div class="text-center mt-4">
        <a href="#" class="text-sm text-blue-400 hover:underline">Quên mật khẩu?</a>
      </div>
    </div>
  </div>
</template>
