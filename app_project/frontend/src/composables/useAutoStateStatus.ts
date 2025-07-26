// src/composables/useAutoStateStatus.ts
import { computed } from 'vue'

export function useAutoStateStatus(stores: any | any[]) {
  const storeList = Array.isArray(stores) ? stores : [stores]

  const activeMessages = computed(() => {
    return storeList.flatMap((store: any) =>
      Object.entries(store.$state)
        .filter(([_, val]) => typeof val === 'boolean' && val === true)
        .map(([key]) => {
          const withoutIs = key.replace(/^is/, '')
          const words = withoutIs
            .replace(/([A-Z])/g, ' $1')
            .trim()
          return words.charAt(0).toUpperCase() + words.slice(1) + '...'
        })
    )
  })

  return { activeMessages }
}
