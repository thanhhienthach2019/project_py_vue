<template>
  <div :data-row-id="materialId ?? 0" class="flex items-center">
    <Pencil
      class="w-5 h-5 cursor-pointer transition-colors"
      :class="isSelected ? 'text-yellow-500' : 'text-gray-500'"
      @click.stop="onEditClick"
    />
    <Trash2
      class="w-5 h-5 ml-3 cursor-pointer transition-colors"
      :class="isSelected ? 'text-red-500' : 'text-gray-500'"
      @click.stop="onDeleteClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  materialId?: number // Optional
  selectedId?: number // Optional
  onEdit?: (id: number) => void // Optional
  onDelete?: (id: number) => void // Optional
}>()

// Log props để gỡ lỗi
// console.log('ActionCellRenderer props:', {
//   materialId: props.materialId,
//   selectedId: props.selectedId,
//   onEdit: props.onEdit,
//   onDelete: props.onDelete,
// })

const isSelected = computed(() => props.selectedId !== undefined && props.materialId !== undefined && props.selectedId === props.materialId)

function onEditClick() {
  if (props.onEdit && props.materialId !== undefined) {
    props.onEdit(props.materialId)
  } else {
    console.warn('onEditClick: Missing onEdit or materialId', {
      onEdit: props.onEdit,
      materialId: props.materialId,
    })
  }
}

function onDeleteClick() {
  if (props.onDelete && props.materialId !== undefined) {
    props.onDelete(props.materialId)
  } else {
    console.warn('onDeleteClick: Missing onDelete or materialId', {
      onDelete: props.onDelete,
      materialId: props.materialId,
    })
  }
}
</script>

<style scoped>
.w-5:hover,
.h-5:hover {
  opacity: 0.9;
}
</style>