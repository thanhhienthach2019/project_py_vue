<template>
  <div
    class="flex items-center justify-center min-h-screen text-[#E0E0E0] p-6 animated-background"
  >
    <div
      class="max-w-xl w-full bg-[#2E3A47]/60 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-white/10 text-center animate-fade-in"
    >
      <div class="mb-6">
        <!-- Modern Illustration Icon -->
        <svg
          class="mx-auto w-24 h-24 text-blue-400 animate-bounce-slow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4v12M24 32v12M4 24h12M32 24h12M10.343 10.343l8.485 8.485M29.172 29.172l8.485 8.485M10.343 37.657l8.485-8.485M29.172 18.828l8.485-8.485"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1
        class="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight"
      >
        404 - Page Not Found
      </h1>
      <p class="mb-8 text-gray-300 text-lg">
        The page you're looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <div class="flex justify-center gap-4">
        <button
          @click="goHome"
          class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Go to Homepage
        </button>
        <button
          @click="goAdmin"
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Back to Admin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function goHome() {
  router.push("/");
}
function goAdmin() {
  router.push("/admin");
}
</script>

<style scoped>
.animated-background {
  background: linear-gradient(-45deg, #1e2a38, #2b3a4a, #252f3d, #1e2a38);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 2.5s infinite;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out;
}
</style>
