<template>
  <div>
    <label class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string | undefined;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>
