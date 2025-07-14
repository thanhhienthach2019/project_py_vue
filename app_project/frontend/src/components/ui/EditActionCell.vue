<template>
  <!-- Action Icons - Minimalist Professional Style -->
  <div class="flex items-center space-x-3">
    <!-- Edit Icon (Pencil) -->
    <div
      @click="handleEdit"
      class="p-2 rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-400/20 hover:border-blue-400/40 shadow-[0_1px_1px_rgba(96,165,250,0.1)] hover:shadow-[0_2px_4px_rgba(96,165,250,0.2)] group"
    >
      <Pencil
        class="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

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
    handleEdit() {
      this.params.context?.onEdit?.(this.params.data);
    },
  },
};
</script>
