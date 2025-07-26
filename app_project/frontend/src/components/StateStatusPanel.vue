<template>
  <div
    v-if="activeMessages.length"
    class="fixed bottom-4 left-4 w-64 bg-gray-900 bg-opacity-90 text-gray-100 p-3 rounded-xl shadow-lg z-50 text-sm space-y-2"
  >
    <div
      v-for="msg in activeMessages"
      :key="msg"
      class="flex items-center space-x-2"
    >
      <Icon icon="mdi:loading" class="animate-spin w-5 h-5 text-blue-400" />
      <span>{{ msg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useAutoStateStatus } from "@/composables/useAutoStateStatus";
import { useRegisteredStateStatusStores } from "@/composables/stateStatusRegistry";

const stores = useRegisteredStateStatusStores();

const { activeMessages } = useAutoStateStatus(stores);
</script>
