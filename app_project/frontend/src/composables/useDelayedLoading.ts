import { ref, watch, onBeforeUnmount } from 'vue'

export function useDelayedLoading(
  isLoading: (() => boolean) | { value: boolean },
  delay = 300
) {
  const isSkeletonVisible = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    isLoading,
    (loading) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      if (loading) {
        isSkeletonVisible.value = true
      } else {
        timer = setTimeout(() => {
          isSkeletonVisible.value = false
          timer = null
        }, delay)
      }
    },
    { immediate: false } 
  )

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return isSkeletonVisible
}