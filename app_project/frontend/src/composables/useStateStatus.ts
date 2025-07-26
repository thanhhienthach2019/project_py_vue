// src/composables/useStateStatus.ts
import { ref, watch, type Ref } from 'vue'

export interface StateStatusItem {
  active: Ref<boolean>
  message: string
}

export function useStateStatus(items: StateStatusItem[]) {
  const activeMessages = ref<string[]>([])

  items.forEach(({ active, message }) => {
    watch(
      active,
      (val) => {
        if (val && !activeMessages.value.includes(message)) {
          activeMessages.value.push(message)
        }
        if (!val) {
          activeMessages.value = activeMessages.value.filter(m => m !== message)
        }
      },
      { immediate: true }
    )
  })

  return { activeMessages }
}
