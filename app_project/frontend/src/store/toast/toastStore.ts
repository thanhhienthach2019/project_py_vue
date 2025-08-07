// src/store/toast/toastStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastVariant = 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  timeout: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])
  let nextId = 1

  function show(
    message: string,
    variant: ToastVariant = 'success',
    duration = 3000
  ) {
    const id = nextId++
    toasts.value.push({ id, message, variant, timeout: duration })
    // tự động xóa sau duration
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, remove }
})
