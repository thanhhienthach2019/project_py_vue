<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <textarea
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      :rows="rows"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all duration-300 resize-y shadow-sm hover:border-purple-400/50"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string | undefined;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}>();

defineEmits<{
  (e: "update:modelValue", value: string | undefined): void;
}>();
</script>
