import { computed, type ComputedRef } from 'vue'

export function useActionDisabled(...flags: ComputedRef<boolean>[]) {
  const isDisabled = computed(() => flags.some(flag => flag.value))
  const disabledClass = computed(() =>
    isDisabled.value ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
  )
  return {
    isDisabled,
    disabledClass
  }
}
