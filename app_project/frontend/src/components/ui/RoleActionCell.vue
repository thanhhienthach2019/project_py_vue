<template>
  <!-- Action Icons - Minimalist Professional Style -->
  <div class="flex items-center space-x-3">
    <!-- Delete Icon (Trash) -->
    <div
      @click="handleDelete"
      class="p-2 rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-400/20 hover:border-red-400/40 shadow-[0_1px_1px_rgba(239,68,68,0.1)] hover:shadow-[0_2px_4px_rgba(239,68,68,0.2)] group"
    >
      <Trash2
        v-permission.disable="'menu:settings:role:delete'"
        class="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "@/store/authStore";

export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  components: {
    Pencil,
    Trash2,
  },
  methods: {
    handleDelete() {
      const auth = useAuthStore();
      if (!auth.permissions.includes("menu:settings:role:delete")) return;

      this.params.context?.onDelete?.(this.params.data);
    },
  },
};
</script>
