<template>
  <div class="flex items-center justify-end">
    <!-- Approved State with Transition -->
    <transition
      appear
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
    >
      <div 
        v-if="isApproved"
        class="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm will-change-transform"
        :class="[
          'bg-emerald-500/8 border-emerald-400/20',
          'hover:bg-emerald-500/12 hover:border-emerald-400/30'
        ]"
      >
        <!-- Animated Checkmark -->
        <svg class="h-4 w-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
          <path 
            d="M13.25 4.75L6 12L2.75 8.75" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-draw-check"
          />
        </svg>
        
        <!-- Text with Gradient -->
        <span class="text-xs font-medium bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
          Approved
        </span>

        <!-- Subtle Pulse Effect -->
        <div class="absolute inset-0 rounded-full opacity-10 animate-pulse-slow bg-emerald-400"></div>
      </div>
    </transition>

    <!-- Approve Action with Transition -->
    <transition
      appear
      mode="out-in"
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-150"
    >
      <button
        v-if="!isApproved"
        key="approve-button"
        @click.stop="handleApprove"
        class="group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm will-change-transform"
        :class="[
          'bg-white/2 border-gray-600/30',
          'hover:bg-emerald-500/8 hover:border-emerald-400/30',
          'active:scale-95 active:bg-emerald-500/12',
          'focus:outline-none focus:ring-2 focus:ring-emerald-400/30',
          isApproving && 'opacity-80 pointer-events-none'
        ]"
        :disabled="isApproving"
      >
        <!-- Loading State -->
        <template v-if="isApproving">
          <svg 
            class="h-4 w-4 animate-spin text-emerald-400" 
            viewBox="0 0 24 24"
          >
            <circle 
              class="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="4" 
              fill="none"
            />
            <path 
              class="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span class="text-xs font-medium text-gray-300">Processing...</span>
        </template>

        <!-- Normal State -->
        <template v-else>
          <svg 
            class="h-4 w-4 text-gray-400 group-hover:text-emerald-400 transition-colors" 
            viewBox="0 0 16 16" 
            fill="none"
          >
            <path 
              d="M13.25 4.75L6 12L2.75 8.75" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span 
            class="text-xs font-medium text-gray-300 group-hover:text-emerald-300 transition-colors"
            :class="{ 'sr-only': !showLabels }"
          >
            Approve
          </span>
        </template>

        <!-- Hover Effect Layer -->
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 bg-emerald-400 transition-opacity"></div>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ApproveCellProps {
  params?: {
    data?: {
      Status?: string
      RequestID?: number
    }
    context?: {
      onApprove?: (id: number) => Promise<void>
    }
  }
  showLabels?: boolean
}

const props = withDefaults(defineProps<ApproveCellProps>(), {
  showLabels: true
})

const isApproving = ref(false)

const isApproved = computed(() => {
  return props.params?.data?.Status === 'Approved'
})

const handleApprove = async () => {
  if (!props.params?.context?.onApprove || !props.params.data?.RequestID) return
  
  try {
    isApproving.value = true
    await props.params.context.onApprove(props.params.data.RequestID)
  } finally {
    isApproving.value = false
  }
}
</script>

<style scoped>
@keyframes draw-check {
  0% {
    stroke-dasharray: 17;
    stroke-dashoffset: 17;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@keyframes pulse-slow {
  0%, 100% { 
    opacity: 0.1;
    transform: scale(0.95);
  }
  50% { 
    opacity: 0.05;
    transform: scale(1);
  }
}

.animate-draw-check {
  animation: draw-check 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.will-change-transform {
  will-change: transform, opacity;
}
</style>