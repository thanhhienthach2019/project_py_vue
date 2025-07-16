<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/hooks/auth/useAuth";
import { Icon } from "@iconify/vue";

const authHooks = useAuth();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const rememberMe = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await authHooks.login(username.value, password.value);
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-300 hover:shadow-2xl"
    >
      <!-- Header Section -->
      <div class="text-center space-y-4">
        <div class="inline-flex items-center gap-2">
          <Icon icon="mdi:shield-lock" class="text-4xl text-indigo-400" />
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          >
            SecureAuth
          </h1>
        </div>
        <p class="text-gray-300 text-sm">
          Welcome back! Please sign in to continue
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username Field -->
        <div class="group relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-indigo-400"
          >
            <Icon icon="mdi:account-outline" class="w-5 h-5" />
          </div>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 text-gray-200 placeholder-gray-400 transition-all"
            placeholder=" "
            required
          />
          <label
            for="username"
            class="absolute left-9 top-2 px-1 text-gray-400 text-sm transition-all pointer-events-none group-focus-within:!-top-2.5 group-focus-within:!text-xs group-focus-within:text-indigo-400 [input:not(:placeholder-shown)+&]:-top-2.5 [input:not(:placeholder-shown)+&]:text-xs"
          >
            Username
          </label>
        </div>

        <!-- Password Field -->
        <div class="group relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-indigo-400"
          >
            <Icon icon="mdi:lock-outline" class="w-5 h-5" />
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 text-gray-200 placeholder-gray-400 transition-all"
            placeholder=" "
            required
          />
          <label
            for="password"
            class="absolute left-9 top-2 px-1 text-gray-400 text-sm transition-all pointer-events-none group-focus-within:!-top-2.5 group-focus-within:!text-xs group-focus-within:text-indigo-400 [input:not(:placeholder-shown)+&]:-top-2.5 [input:not(:placeholder-shown)+&]:text-xs"
          >
            Password
          </label>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-4 h-4 text-indigo-400 bg-white/5 border border-white/10 rounded focus:ring-indigo-400"
            />
            <span class="text-gray-300 text-sm">Remember me</span>
          </label>
          <a
            href="#"
            class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="flex items-center gap-2 p-3 bg-red-400/10 text-red-300 text-sm rounded-lg border border-red-400/20"
        >
          <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0 w-5 h-5" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden"
        >
          <span :class="{ 'opacity-0': loading }">Sign In</span>
          <div
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <Icon icon="mdi:loading" class="animate-spin w-6 h-6" />
          </div>
        </button>

        <!-- Social Login -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-transparent text-gray-400"
              >Or continue with</span
            >
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 py-2.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-gray-300"
          >
            <Icon icon="mdi:google" class="w-5 h-5" />
            <span>Google</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 py-2.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-gray-300"
          >
            <Icon icon="mdi:github" class="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </div>
      </form>

      <!-- Registration Prompt -->
      <p class="text-center text-gray-400 text-sm">
        Don't have an account?
        <a
          href="#"
          class="text-indigo-400 hover:text-indigo-300 transition-colors"
          >Create account</a
        >
      </p>
    </div>
  </div>
</template>
