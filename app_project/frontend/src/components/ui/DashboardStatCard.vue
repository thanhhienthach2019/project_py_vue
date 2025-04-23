<template>
    <div 
      class="bg-white/5 rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 group"
      :class="`hover:border-${color}-400/50`"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm">{{ title }}</p>
          <h3 class="text-2xl font-bold text-white mt-1">{{ value }}</h3>
        </div>
        <div 
          class="p-3 rounded-lg transition-all"
          :class="`bg-${color}-400/10 group-hover:bg-${color}-400/20`"
        >
          <!-- Đảm bảo icon không undefined -->
          <Icon v-if="icon" :icon="icon" class="text-2xl" :class="`text-${color}-400`" />
        </div>
      </div>
      <div class="mt-4 flex items-center text-sm" :class="trendColor">
        <!-- Đảm bảo trendIcon luôn có giá trị -->
        <Icon v-if="trendIcon" :icon="trendIcon" class="mr-1" />
        <span>{{ trendValue }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import { computed } from "vue";
  
  const props = defineProps({
    icon: {
      type: String,
      default: 'mdi:chart-line', // hoặc icon mặc định tùy ý
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    trend: {
      type: String as () => 'up' | 'down' | 'neutral',
      default: 'neutral',
      validator: (value: string) => ['up', 'down', 'neutral'].includes(value),
    },
    trendValue: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'blue',
    },
  });
  
  const trendIcon = computed(() => {
    return {
      up: 'mdi:trending-up',
      down: 'mdi:trending-down',
      neutral: 'mdi:trending-neutral',
    }[props.trend];
  });
  
  const trendColor = computed(() => {
    return {
      up: 'text-green-400',
      down: 'text-red-400',
      neutral: 'text-yellow-400',
    }[props.trend];
  });
  </script>
  