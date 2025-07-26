<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Session Expired</h3>
      <p class="mb-6">
        Your session has expired due to inactivity. Would you like to renew your
        session?
      </p>

      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('logout')"
          class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Logout
        </button>
        <button
          @click="$emit('refresh')"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Renew Session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(["refresh", "logout"]);
</script>
