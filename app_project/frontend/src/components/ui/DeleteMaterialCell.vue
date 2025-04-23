<template>
  <div
    @click.stop="handleDelete"
    class="p-2 rounded-lg cursor-pointer transition-all duration-300
           bg-gradient-to-br from-red-500/10 to-red-600/10
           hover:from-red-500/20 hover:to-red-600/20
           border border-red-400/20 hover:border-red-400/40
           shadow-[0_1px_1px_rgba(239,68,68,0.1)] hover:shadow-[0_2px_4px_rgba(239,68,68,0.2)]
           group"
  >
    <Trash2 class="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{ params: any }>()

const onDeleteMaterial = props.params.context.onDeleteMaterial as (params: any) => void

function handleDelete() {
  onDeleteMaterial(props.params)
}
</script>
