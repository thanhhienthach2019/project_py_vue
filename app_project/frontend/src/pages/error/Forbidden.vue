<template>
  <div class="flex items-center justify-center min-h-screen text-[#E0E0E0] p-6 animated-background">
    <div class="max-w-xl w-full bg-[#2E3A47]/60 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-white/10 text-center animate-fade-in">
      <div class="mb-6">
        <!-- Modern Shield-Lock Icon -->
        <svg class="mx-auto w-24 h-24 text-red-400 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L6 12v10c0 11.046 9.163 20 18 20s18-8.954 18-20V12L24 4z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M24 22v6M24 32h.01" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent leading-tight">
        403 - Access Denied
      </h1>
      <p class="mb-8 text-gray-300 text-lg">
        You do not have permission to view this page or access this feature.
      </p>
      <button
        @click="goHome"
        class="inline-block px-8 py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
      >
        Go Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function goHome() {
  router.push('/');
}
</script>

<style scoped>
.animated-background {
  background: linear-gradient(-45deg, #1E2A38, #2B3A4A, #252F3D, #1E2A38);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.animate-pulse-slow {
  animation: pulseSlow 2.5s ease-in-out infinite;
}
</style>
