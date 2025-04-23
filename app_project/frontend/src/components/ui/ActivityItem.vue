<template>
    <div class="flex items-start pb-4 border-b border-white/5 last:border-0">
      <div 
        class="p-2 rounded-lg mr-4 flex-shrink-0"
        :class="`bg-${color}-400/10 border border-${color}-400/20`"
      >
        <Icon v-if="icon" :icon="icon" class="text-lg" :class="`text-${color}-400`" />
      </div>
      <div class="flex-1">
        <p class="text-white font-medium">{{ title }}</p>
        <p class="text-gray-400 text-sm mt-1">{{ description }}</p>
        <p class="text-gray-500 text-xs mt-1">{{ time }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Icon } from "@iconify/vue";
  
  defineProps({
    icon: {
      type: String,
      default: 'mdi:bell-outline' // hoặc icon mặc định tùy ý
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'blue'
    }
  });
  </script>
  