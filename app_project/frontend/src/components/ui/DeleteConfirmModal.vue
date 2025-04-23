<template>
  <!-- Delete Confirmation Modal -->
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
  >
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl w-[480px] transform transition-all duration-500 scale-95 hover:scale-100">
      <!-- Modal Header -->
      <div class="flex items-start space-x-4">
        <!-- Warning Icon -->
        <div class="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <h2 class="text-2xl font-semibold text-white mb-1">Confirm Deletion</h2>
          <p class="text-gray-400 font-medium">This action cannot be undone. Are you sure you want to permanently delete this material?</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex items-center justify-end space-x-4">
        <button 
          @click="closeModal"
          class="group relative px-6 py-3 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-xl flex items-center gap-2 hover:bg-gray-600/70 transition-all duration-300 border border-white/10 hover:border-white/20"
        >
          <span class="text-gray-200 font-medium tracking-wide">Cancel</span>
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
        </button>

        <button 
          @click="confirmDelete"
          class="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-xl flex items-center gap-2 hover:shadow-red-500/20 hover:shadow-xl transition-all duration-300"
        >
          <svg class="w-5 h-5 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span class="text-red-100 font-semibold tracking-wide">Delete Permanently</span>
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emit("close");
};

const confirmDelete = () => {
  emit("confirm");
};
</script>